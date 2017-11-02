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
  CLEAR_STORAGE,
  SHOW_TOKEN_RENEWAL,
  HIDE_TOKEN_RENEWAL,
  LAUNCH_WAITING_FOR_TOKEN_EXPIRE
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

type SimpleType = {
  +type: string,
};

export const loginSuccess = (
  tokenId: string,
  tokenExpires: string,
  tenant: TenantType,
  user: UserType
): LoginSuccessActionType => {
  sessionStorage.setItem('token', tokenId);
  sessionStorage.setItem('tokenExpires', tokenExpires);

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
  const tenantId = sessionStorage.getItem('tenantId');

  if (token) {
    return {
      type: LOGIN,
      token,
      tenant,
      tenantId
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
    sessionStorage.setItem('tenantId', tenant.id);

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

export const selectTenant = (tenantName: string, tenantId: string): SelectTenantActionType => ({
  type: SELECT_TENANT,
  tenantName,
  tenantId
});

export const showTokenRenewal = (): () => void => {
  return (dispatch: () => void) => {
    dispatch({
      type: SHOW_TOKEN_RENEWAL
    });
  };
};

export const hideTokenRenewal = (): SimpleType => {
  return {
    type: HIDE_TOKEN_RENEWAL
  };
};

export const waitForTokenExpire = (): () => void => {
  const tokenExpires = sessionStorage.getItem('tokenExpires');

  return (dispatch: () => void) => {
    const earlyWarningTime = 5 * 60 * 1000; // warn 5 minutes earlier
    const now = new Date();
    let offset = new Date(tokenExpires) - now;

    if (offset > earlyWarningTime) {
      offset -= earlyWarningTime;
    }

    dispatch({
      type: LAUNCH_WAITING_FOR_TOKEN_EXPIRE
    });

    setTimeout(() => {
      dispatch(showTokenRenewal());
    }, offset);
  };
};
