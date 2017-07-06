// @flow
/* global window */
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  SELECT_TENANT,
  SELECT_TENANT_FAILURE,
  FETCH_TENANTS_SUCCESS,
  FETCH_TENANTS_FAILURE,
  CLEAR_STORAGE
} from './AuthActionTypes';

const {sessionStorage, location} = window;

type UserType = {
  +id: string,
  +name: string,
  +roles: any, // eslint-disable-line flowtype/no-weak-types
  +roles_links: any, // eslint-disable-line flowtype/no-weak-types
  +username: string,
};

type TenantType = {
  +id: string,
  +name: string,
  +enabled: boolean,
  +description: string,
};

type LoginActionType = {
  +type: string,
  +username: string,
  +password: string,
};

type LoginSuccessActionType = {
  +type: string,
  +data: {
    +tokenId: string,
    +tokenExpires: string,
    +tenant: string,
    +user: string,
  },
  +password: string,
};

type FetchTenantSuccessActionType = {
  +type: string,
  +data: [TenantType],
};

type FetchTokenActionType = {
  +type: string,
  +token: string,
  +tenant: string,
};

type SelectTenantActionType = {
  +type: string,
  +username: string,
  +password: string,
};

type ErrorActionType = {
  +type: string,
  +error: string,
};

export const loginSuccess = (
  tokenId: string,
  tokenExpires: string,
  tenant: TenantType,
  user: UserType
): LoginSuccessActionType => {
  sessionStorage.setItem('token', tokenId);

  return {
    type: LOGIN_SUCCESS,
    data: {
      tokenId,
      tokenExpires,
      tenant,
      user,
    },
  };
};

export const loginFailure = (error: string): ErrorActionType => ({
  type: LOGIN_ERROR,
  error,
});

export const login = (username: string, password: string): LoginActionType => ({
  type: LOGIN,
  username,
  password
});

export const fetchTenantSuccess = (data: [TenantType]): FetchTenantSuccessActionType => ({
  type: FETCH_TENANTS_SUCCESS,
  data,
});

export const fetchTenantFailure = (error: string): ErrorActionType => ({
  type: FETCH_TENANTS_FAILURE,
  error,
});

export const fetchTokenData = (): FetchTokenActionType => {
  const token = sessionStorage.getItem('token');
  const tenant = sessionStorage.getItem('tenant');

  if (token) {
    return {
      type: LOGIN,
      token,
      tenant
    };
  }
  return clearStorage();
};

export const clearStorage = (): () => void => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('scopedToken');
  sessionStorage.removeItem('tenant');

  return {
    type: CLEAR_STORAGE
  };
};

export const logout = (): () => void => {
  return (dispatch: () => void) => {
    dispatch(clearStorage());
    dispatch({type: LOGOUT});
    location.reload();
  };
};

export const selectTenantSuccess = (
  tokenId: string,
  tokenExpires: string,
  tenant: TenantType,
  user: UserType
): LoginSuccessActionType => {
    sessionStorage.setItem('scopedToken', tokenId);
    sessionStorage.setItem('tenant', tenant.name);

    return {
      type: LOGIN_SUCCESS,
      data: {
        tokenId,
        tokenExpires,
        tenant,
        user,
      },
    };
};

export const selectTenantFailure = (error: string): ErrorActionType => ({
  type: SELECT_TENANT_FAILURE,
  error,
});

export const selectTenant = (tenantName: string): SelectTenantActionType => ({
  type: SELECT_TENANT,
  tenantName
});
