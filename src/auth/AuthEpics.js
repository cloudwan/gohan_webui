import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';

import {get, post, parseXHRError} from './../api';
import {
  LOGIN,
  FETCH_TENANTS,
  SELECT_TENANT,
  RENEW_TOKEN
} from './AuthActionTypes';
import {
  loginSuccess,
  loginFailure,
  fetchTenantSuccess,
  fetchTenantFailure,
  selectTenantSuccess,
  selectTenantFailure,
  showTokenRenewal,
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

export const login = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(LOGIN)
    .mergeMap(({username, password, token, tenant, tenantId}) => {
      const state = store.getState();
      const {authUrl} = state.configReducer;
      const headers = {
        'Content-Type': 'application/json'
      };
      const data = {
        auth: {}
      };

      if (/v3$/.test(authUrl)) {
        if (username !== undefined && password !== undefined) {
          data.auth.identity = {
            methods: [
              'password'
            ],
            password: {
              user: {
                domain: {
                  name: 'default'
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
          } else {
            data.auth.scope = 'unscoped';
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
      } else if (/v2.0$/.test(authUrl)) {
        if (username !== undefined && password !== undefined) {
          data.auth.passwordCredentials = {
            username,
            password
          };
        } else if (token) {
          data.auth.token = {
            id: token
          };
        }

        if (tenant) {
          data.auth.tenantName = tenant;
        }

        return call(
          post,
          `${authUrl}/tokens`,
          headers,
          data
        )
          .flatMap(response => {
            const offset = computeOffsetForTokenRenewal(response.response.access.token.expires);

            return Observable.concat(
                Observable.of(loginSuccess(
                  response.response.access.token.id,
                  response.response.access.token.expires,
                  response.response.access.token.tenant,
                  response.response.access.user
                )),
                Observable.of({type: FETCH_TENANTS}),
                Observable.of(showTokenRenewal()).delay(offset));
            }
          )
          .catch(error => Observable.of(loginFailure(parseXHRError(error))));
      }
      console.log('Wrong auth url! Please check config.json.');
      return Observable.of(loginFailure('Wrong auth url! Please check config.json.'));
    });
};

export const selectTenant = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(SELECT_TENANT)
    .mergeMap(({tenantName, tenantId}) => {
      const state = store.getState();
      const {authUrl} = state.configReducer;
      const {tokenId} = state.authReducer;
      const headers = {
        'Content-Type': 'application/json'
      };
      const data = {
        auth: {}
      };

      if (/v3$/.test(authUrl)) {
        data.auth = {
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
      } else if (/v2.0$/.test(authUrl)) {
        data.auth = {
          token: {
            id: tokenId
          },
          tenantName
        };

        return call(
          post,
          `${authUrl}/tokens`,
          headers,
          data
        )
          .flatMap(response => Observable.concat(
            Observable.of(selectTenantSuccess(
              response.response.access.token.id,
              response.response.access.token.expires,
              response.response.access.token.tenant,
              response.response.access.user
            )))
          )
          .catch(error => Observable.of(selectTenantFailure(parseXHRError(error))));
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

      if (/v3$/.test(authUrl)) {
        return call(
          get,
          `${authUrl}/auth/projects`,
          headers
        )
          .map(response => fetchTenantSuccess(response.response.projects))
          .catch(error => Observable.of(fetchTenantFailure(parseXHRError(error))));
      } else if (/v2.0$/.test(authUrl)) {
        return call(
          get,
          `${authUrl}/tenants`,
          headers
        )
          .map(response => fetchTenantSuccess(response.response.tenants))
          .catch(error => Observable.of(fetchTenantFailure(parseXHRError(error))));
      }
      console.log('Wrong auth url! Please check config.json.');
      return Observable.of(fetchTenantFailure('Wrong auth url! Please check config.json.'));
    });
};

export const renewToken = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(RENEW_TOKEN)
    .mergeMap(({username, password, token}) => {
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

      const data = {
        auth: {}
      };

      if (/v3$/.test(authUrl)) {
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
            }
          )
          .catch(error => Observable.of(renewTokenFailure(parseXHRError(error))));

      } else if (/v2.0$/.test(authUrl)) {
        if (password !== undefined) {
          data.auth.passwordCredentials = {
            username,
            password
          };
        } else {
          console.error('Password is not provided');
        }

        if (tenant && tenant.name) {
          data.auth.tenantName = tenant.name;
        }

        return call(
          post,
          `${authUrl}/tokens`,
          headers,
          data
        )
          .flatMap(response => {
            const offset = computeOffsetForTokenRenewal(response.response.access.token.expires);

            return Observable.concat(
                Observable.of(renewTokenSuccess(
                  response.response.access.token.id,
                  response.response.access.token.expires,
                  response.response.access.token.tenant,
                  response.response.access.user
                )),
                Observable.of(showTokenRenewal()).delay(offset));
            }
          )
          .catch(error => Observable.of(renewTokenFailure(parseXHRError(error))));
      }
    });
};

export default combineEpics(login, selectTenant, fetchTenants, renewToken);
