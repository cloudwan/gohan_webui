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
  RENEW_TOKEN,
  RENEW_TOKEN_SUCCESS,
  RENEW_TOKEN_FAILURE,
  INIT_SESSION_STORAGE_TRANSFER,
  TRANSFER_STORAGE
} from './authActionTypes';

const {sessionStorage, localStorage, location} = window;

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

type RenewTokenInBackgroundType = {
  +type: string,
  +tenantId: string,
  +token: string,
};

type RenewTokenType = {
  +type: string,
  +username: string,
  +tenantId: string,
  +tenant: string,
};

type ShowTokenRenewalType = {
  +type: string,
};

type RenewTokenFailureType = {
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
  const tenant = sessionStorage.getItem('tenantName');
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
  sessionStorage.removeItem('tenantName');
  sessionStorage.removeItem('tenantId');
  sessionStorage.removeItem('tokenExpires');

  return {
    type: CLEAR_STORAGE
  };
};

export const logout = (): () => void => {
  return (dispatch: () => void, getState: () => void) => {
    const {storagePrefix} = getState().configReducer;

    localStorage.setItem(`${storagePrefix}clearSessionStorage`, 'true');
    setTimeout(() => {
      localStorage.removeItem(`${storagePrefix}clearSessionStorage`);
    }, 0);
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
    sessionStorage.setItem('tenantName', tenant.name);
    sessionStorage.setItem('tenantId', tenant.id);
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

export const selectTenantFailure = (error: string): ErrorActionType => ({
  type: SELECT_TENANT_FAILURE,
  error,
});

export const selectTenant = (tenantName: string, tenantId: string): SelectTenantActionType => ({
  type: SELECT_TENANT,
  tenantName,
  tenantId
});

export const showTokenRenewal = (): ShowTokenRenewalType => {
  return {
    type: SHOW_TOKEN_RENEWAL
  };
};

export const renewTokenInBackground = (): RenewTokenInBackgroundType => {
  const token = sessionStorage.getItem('token');

  return {
    type: RENEW_TOKEN,
    token
  };
};

export const renewToken = (username: string, password: string): RenewTokenType => {
  return {
    type: RENEW_TOKEN,
    username,
    password
  };
};

export const renewTokenSuccess = (
  tokenId: string,
  tokenExpires: string,
  tenant: TenantType,
  user: UserType
): LoginSuccessActionType => {
  sessionStorage.setItem('token', tokenId);
  sessionStorage.setItem('tokenExpires', tokenExpires);

  return {
    type: RENEW_TOKEN_SUCCESS,
    data: {
      tokenId,
      tokenExpires,
      tenant,
      user,
    }
  };
};

export const renewTokenFailure = (error: string): RenewTokenFailureType => {
  return {
    type: RENEW_TOKEN_FAILURE,
    error
  };
};

export const sessionStorageTransfer = (event: object): () => void => {
  return (dispatch: () => void, getState: () => void) => {
    const {storagePrefix} = getState().configReducer;

    dispatch({
      type: INIT_SESSION_STORAGE_TRANSFER
    });

    if (!event.newValue) {
      return;
    }
    if (event.key === `${storagePrefix}getSessionStorage`) {
      localStorage.setItem(`${storagePrefix}sessionStorage`, JSON.stringify(sessionStorage));
      setTimeout(() => {
        localStorage.removeItem(`${storagePrefix}sessionStorage`);
        localStorage.removeItem(`${storagePrefix}getSessionStorage`);
      }, 0);
    } else if (event.key === `${storagePrefix}sessionStorage` && !sessionStorage.length) {
      const data = JSON.parse(event.newValue);
      for (let key in data) {
        sessionStorage.setItem(key, data[key]);
      }

      if (Object.keys(data).length > 0) {
        location.reload();
      }
    } else if (event.key === `${storagePrefix}clearSessionStorage`) {
      dispatch(logout());
    }
  };
};

export const transferStorage = (): () => void => {
  return (dispatch: () => {}, getState: () => void) => {
    const {storagePrefix} = getState().configReducer;

    if (!sessionStorage.length) {
      localStorage.setItem(`${storagePrefix}getSessionStorage`, 'true');
      setTimeout(() => {
        localStorage.removeItem(`${storagePrefix}getSessionStorage`);
      }, 500);
    }

    dispatch({
      type: TRANSFER_STORAGE
    });
  };
};


