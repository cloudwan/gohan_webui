import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';

import {get, post, parseXHRError} from './../api';
import {
  LOGIN,
  CHECK_TOKEN,
  FETCH_TENANTS,
  SELECT_TENANT,
  RENEW_TOKEN
} from './AuthActionTypes';
import {
  loginSuccess,
  loginFailure,
  checkTokenSuccess,
  fetchTenantSuccess,
  fetchTenantFailure,
  selectTenantSuccess,
  selectTenantFailure,
  renewTokenSuccess,
  renewTokenFailure,
  renewTokenInBackground
} from './AuthActions';

const computeOffsetForTokenRenewal = date => {
  const earlyWarningTime = 5 * 60 * 1000; // warn/renew 5 minutes earlier
  const now = new Date();
  let offset = new Date(date) - now;

  if (offset > earlyWarningTime) {
    offset -= earlyWarningTime;
  }

  return offset;
};

export const getTokenInfo = (authUrl, token, call = (fn, ...args) => fn(...args)) =>
  call(
    get,
    `${authUrl}/auth/tokens`,
    {
      'Content-Type': 'application/json',
      'X-Auth-Token': token,
      'X-Subject-Token': token,
    }
  )
    .map(response => ({
      token: response.xhr.getResponseHeader('X-Subject-Token'),
      ...response.response.token,
    }))
    .catch(error => Observable.of(parseXHRError(error)));


export const checkToken = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(CHECK_TOKEN)
    .mergeMap(({unscopedToken, token}) => {
      const state = store.getState();
      const {
        authUrl,
      } = state.configReducer;

      return Observable.zip(
        call(getTokenInfo, authUrl, unscopedToken),
        call(getTokenInfo, authUrl, token)
      ).flatMap(item => [
        checkTokenSuccess(
          item[0].token,
          item[1].token,
          item[1].expires_at,
          item[1].project,
          item[1].user
        ),
        {type: FETCH_TENANTS}
      ]);
    });

export const login = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(LOGIN)
    .mergeMap(({username, password, domain, token, tenantId}) => {
      const state = store.getState();
      const {
        authUrl,
        useKeystoneDomain,
        domainName
      } = state.configReducer;
      const headers = {
        'Content-Type': 'application/json'
      };


      if (authUrl) {
        const data = {
          auth: {
            scope: 'unscoped'
          },

        };

        if (username !== undefined && password !== undefined) {
          data.auth.identity = {
            methods: [
              'password'
            ],
            password: {
              user: {
                domain: {
                  name: useKeystoneDomain ? domainName || domain : 'default'
                },
                name: username,
                password
              }
            }
          };
        } else if (token) {
          data.auth = {
            identity: {
              methods: [
                'token'
              ],
              token: {
                id: token
              }
            }
          };

          if (tenantId) {
            data.auth.scope = {
              project: {
                id: tenantId
              }
            };
          }
        }

        return call(
          post,
          `${authUrl}/auth/tokens`,
          headers,
          data
        )
          .flatMap(response => {
              const offset = computeOffsetForTokenRenewal(response.response.token.expires_at);

              return Observable.concat(
                Observable.of(loginSuccess(
                  response.xhr.getResponseHeader('X-Subject-Token'),
                  response.response.token.expires_at, // eslint-disable-line camelcase
                  tenantId ? response.response.token.project : undefined,
                  response.response.token.user
                )),
                Observable.of({type: FETCH_TENANTS}),
                Observable.of(renewTokenInBackground()).delay(offset)
              );
            }
          )
          .catch(error => Observable.of(loginFailure(parseXHRError(error))));
      }

      console.log('Wrong auth url! Please check config.json.');
      return Observable.of(fetchTenantFailure('Wrong auth url! Please check config.json.'));
    });
};

export const selectTenant = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(SELECT_TENANT)
    .mergeMap(({tenantId}) => {
      const state = store.getState();
      const {authUrl} = state.configReducer;
      const {tokenId} = state.authReducer;
      const headers = {
        'Content-Type': 'application/json'
      };

      if (authUrl) {
        const data = {
          auth: {
            identity: {
              methods: [
                'token'
              ],
              token: {
                id: tokenId
              }
            },
            scope: {
              project: {
                id: tenantId
              }
            }
          }
        };

        return call(
          post,
          `${authUrl}/auth/tokens`,
          headers,
          data
        )
          .flatMap(response => Observable.concat(
            Observable.of(selectTenantSuccess(
              response.xhr.getResponseHeader('X-Subject-Token'),
              response.response.token.expires_at, // eslint-disable-line camelcase
              response.response.token.project,
              response.response.token.user
            )))
          )
          .catch(error => {
            console.log(error);
            return Observable.of(selectTenantFailure(parseXHRError(error)));
          });
      }

      console.log('Wrong auth url! Please check config.json.');
      return Observable.of(selectTenantFailure('Wrong auth url! Please check config.json.'));
    });
};

export const fetchTenants = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(FETCH_TENANTS)
    .mergeMap(() => {
      const state = store.getState();
      const {authUrl} = state.configReducer;
      const {tokenId} = state.authReducer;
      const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': tokenId
      };

      if (authUrl) {
        return call(
          get,
          `${authUrl}/auth/projects`,
          headers
        )
          .map(response => fetchTenantSuccess(response.response.projects))
          .catch(error => Observable.of(fetchTenantFailure(parseXHRError(error))));
      }

      console.log('Wrong auth url! Please check config.json.');
      return Observable.of(fetchTenantFailure('Wrong auth url! Please check config.json.'));
    });
};

export const renewToken = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(RENEW_TOKEN)
    .mergeMap(({token}) => {
      const state = store.getState();
      const {authUrl} = state.configReducer;
      const {
        tokenId,
        tenant
      } = state.authReducer;
      const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': tokenId
      };

      if (authUrl) {
        const data = {
          auth: {
            identity: {
              methods: [
                'token'
              ],
              token: {
                id: token
              }
            }
          }
        };

        if (tenant && tenant.id) {
          data.auth.scope = {
            project: {
              id: tenant.id
            }
          };
        } else {
          data.auth.scope = 'unscoped';
        }

        return call(
          post,
          `${authUrl}/auth/tokens`,
          headers,
          data
        )
          .flatMap(response => {
            const offset = computeOffsetForTokenRenewal(response.response.token.expires_at);

            return Observable.concat(
              Observable.of(renewTokenSuccess(
                response.xhr.getResponseHeader('X-Subject-Token'),
                response.response.token.expires_at, // eslint-disable-line camelcase
                tenant && tenant.id ? response.response.token.project : undefined,
                response.response.token.user
              )),
              Observable.of(renewTokenInBackground()).delay(offset));
          })
          .catch(error => Observable.of(renewTokenFailure(parseXHRError(error))));
      }

      console.log('Wrong auth url! Please check config.json.');
      return Observable.of(fetchTenantFailure('Wrong auth url! Please check config.json.'));
    });
};

export default combineEpics(login, selectTenant, fetchTenants, renewToken, checkToken);
