import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';

import {get, post, parseXHRError} from './../api';
import {
  LOGIN,
  FETCH_TENANTS,
  SELECT_TENANT
} from './AuthActionTypes';
import {
  loginSuccess,
  loginFailure,
  fetchTenantSuccess,
  fetchTenantFailure,
  selectTenantSuccess,
  selectTenantFailure
} from './AuthActions';

export const login = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(LOGIN)
    .mergeMap(({username, password, token, tenant, tenantId}) => {
      const state = store.getState();
      const {keystoneVersion, authUrl} = state.configReducer;
      const headers = {
        'Content-Type': 'application/json'
      };
      const data = {
        auth: {}
      };

      if (keystoneVersion === 'v3') {
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
          `${authUrl}/v3/auth/tokens`,
          headers,
          data
        )
          .flatMap(response => Observable.concat(
            Observable.of(loginSuccess(
              response.xhr.getResponseHeader('X-Subject-Token'),
              response.response.token.expires_at, // eslint-disable-line camelcase
              tenantId ? response.response.token.project : undefined,
              response.response.token.user
            )),
            Observable.of({type: FETCH_TENANTS}))
          )
          .catch(error => Observable.of(loginFailure(parseXHRError(error))));
      }


      if (keystoneVersion === undefined) {
        console.warn('No "keystoneVersion" in config.json!');
      }

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
        .flatMap(response => Observable.concat(
          Observable.of(loginSuccess(
            response.response.access.token.id,
            response.response.access.token.expires,
            response.response.access.token.tenant,
            response.response.access.user
          )),
          Observable.of({type: FETCH_TENANTS}))
        )
        .catch(error => Observable.of(loginFailure(parseXHRError(error))));
    });
};

export const selectTenant = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(SELECT_TENANT)
    .mergeMap(({tenantName, tenantId}) => {
      const state = store.getState();
      const {authUrl, keystoneVersion} = state.configReducer;
      const {tokenId} = state.authReducer;
      const headers = {
        'Content-Type': 'application/json'
      };
      const data = {
        auth: {}
      };

      if (keystoneVersion === 'v3') {
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
          `${authUrl}/v3/auth/tokens`,
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

      if (keystoneVersion === undefined) {
        console.warn('No "keystoneVersion" in config.json!');
      }

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
    });
};

export const fetchTenants = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(FETCH_TENANTS)
    .mergeMap(() => {
      const state = store.getState();
      const {authUrl, keystoneVersion} = state.configReducer;
      const {tokenId} = state.authReducer;
      const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': tokenId
      };

      if (keystoneVersion === 'v3') {
        return call(
          get,
          `${authUrl}/v3/auth/projects`,
          headers
        )
          .map(response => fetchTenantSuccess(response.response.projects))
          .catch(error => Observable.of(fetchTenantFailure(parseXHRError(error))));
      }

      if (keystoneVersion === undefined) {
        console.warn('No "keystoneVersion" in config.json!');
      }

      return call(
        get,
        `${authUrl}/tenants`,
        headers
      )
        .map(response => fetchTenantSuccess(response.response.tenants))
        .catch(error => Observable.of(fetchTenantFailure(parseXHRError(error))));
    });
};

export default combineEpics(login, selectTenant, fetchTenants);
