import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';

import {get, post, parseXHRError} from './../api';
import {
  LOGIN,
  FETCH_TENANTS,
  SELECT_TENANT,
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
    .mergeMap(({username, password, token, tenant}) => {
      const state = store.getState();
      const {authUrl} = state.configReducer;
      const headers = {
        'Content-Type': 'application/json'
      };
      const data = {
        auth: {}
      };

      if (username !== undefined && password !== undefined) {
        data.auth.passwordCredentials = {
          username,
          password
        };
      } else if (token) {
        data.auth.token = {
          id: token,
        };
      }

      if (tenant) {
        data.auth.tenantName = tenant;
      }
      return call(
        post,
        `${authUrl}/tokens`,
        headers,
        data,
      )
        .flatMap(response => Observable.concat(
          Observable.of(loginSuccess(
            response.response.access.token.id,
            response.response.access.token.expires,
            response.response.access.token.tenant,
            response.response.access.user,
          )),
          Observable.of({type: FETCH_TENANTS})),
        )
        .catch(error => Observable.of(loginFailure(parseXHRError(error))));
      }
    );
};

export const selectTenant = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(SELECT_TENANT)
    .mergeMap(({tenantName}) => {
      const state = store.getState();
      const {authUrl} = state.configReducer;
      const {tokenId} = state.authReducer;
      const headers = {
        'Content-Type': 'application/json'
      };
      const data = {
        auth: {
          token: {
            id: tokenId
          },
          tenantName
        }
      };

      return call(
        post,
        `${authUrl}/tokens`,
        headers,
        data,
      )
        .flatMap(response => Observable.concat(
          Observable.of(selectTenantSuccess(
            response.response.access.token.id,
            response.response.access.token.expires,
            response.response.access.token.tenant,
            response.response.access.user,
          )))
        )
        .catch(error => Observable.of(selectTenantFailure(parseXHRError(error))));
      }
    );
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

      return call(
        get,
        `${authUrl}/tenants`,
        headers,
      )
        .map(response => fetchTenantSuccess(response.response.tenants))
        .catch(error => Observable.of(fetchTenantFailure(parseXHRError(error))));
      }
    );
};

export default combineEpics(login, selectTenant, fetchTenants);
