/* global window */
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  CHECK_TOKEN,
  CHECK_SUCCESS,
  SELECT_TENANT,
  SELECT_TENANT_FAILURE,
  SELECT_TENANT_SUCCESS,
  FETCH_TENANTS_SUCCESS,
  FETCH_TENANTS_FAILURE,
  CLEAR_STORAGE,
  SHOW_TOKEN_RENEWAL,
  RENEW_TOKEN,
  RENEW_TOKEN_SUCCESS,
  RENEW_TOKEN_FAILURE,
  INIT_SESSION_STORAGE_TRANSFER,
  TRANSFER_STORAGE,
  CHANGE_TENANT_FILTER_STATUS
} from './AuthActionTypes';

const {sessionStorage, localStorage, location} = window;

export const loginSuccess = (
  tokenId,
  tokenExpires,
  tenant,
  user
) => {
  sessionStorage.setItem('scopedToken', tokenId);
  sessionStorage.setItem('unscopedToken', tokenId);

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

export const loginFailure = error => ({
  type: LOGIN_ERROR,
  error,
});

export const login = (username, password, domain) => ({
  type: LOGIN,
  username,
  password,
  domain
});

export const fetchTenantSuccess = data => ({
  type: FETCH_TENANTS_SUCCESS,
  data,
});

export const fetchTenantFailure = error => ({
  type: FETCH_TENANTS_FAILURE,
  error,
});

export const fetchTokenData = () => {
  const unscopedToken = sessionStorage.getItem('unscopedToken');
  const scopedToken = sessionStorage.getItem('scopedToken');

  if (scopedToken) {
    return {
      type: CHECK_TOKEN,
      token: scopedToken,
      unscopedToken,
    };
  }

  return clearStorage();
};

export const checkTokenSuccess = (unscopedToken, token, tokenExpires, tenant, user) => {
  sessionStorage.setItem('scopedToken', token);
  sessionStorage.setItem('unscopedToken', unscopedToken);

  return {
    type: CHECK_SUCCESS,
    data: {
      token,
      unscopedToken,
      tokenExpires,
      tenant,
      user,
    },
  };
};

export const clearStorage = () => {
  sessionStorage.removeItem('scopedToken');
  sessionStorage.removeItem('unscopedToken');

  return {
    type: CLEAR_STORAGE
  };
};

export const logout = () => {
  return (dispatch, getState) => {
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

export const selectTenantSuccess = (tokenId, tokenExpires, tenant, user) => {
    sessionStorage.setItem('scopedToken', tokenId);

    return {
      type: SELECT_TENANT_SUCCESS,
      data: {
        tokenId,
        tokenExpires,
        tenant,
        user,
      },
    };
};

export const selectTenantFailure = error => ({
  type: SELECT_TENANT_FAILURE,
  error,
});

export const selectTenant = (tenantName, tenantId) => ({
  type: SELECT_TENANT,
  tenantName,
  tenantId
});

export const showTokenRenewal = () => {
  return {
    type: SHOW_TOKEN_RENEWAL
  };
};

export const renewTokenInBackground = () => {
  const token = sessionStorage.getItem('scopedToken');

  return {
    type: RENEW_TOKEN,
    token
  };
};

export const renewToken = (username, password) => {
  return {
    type: RENEW_TOKEN,
    username,
    password
  };
};

export const renewTokenSuccess = (tokenId, tokenExpires, tenant, user) => {
  sessionStorage.setItem('scopedToken', tokenId);

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

export const renewTokenFailure = error => {
  return {
    type: RENEW_TOKEN_FAILURE,
    error
  };
};

export const sessionStorageTransfer = event => {
  return (dispatch, getState) => {
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

export const transferStorage = () => {
  return (dispatch, getState) => {
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

export const changeTenantFilter = status => ({
  type: CHANGE_TENANT_FILTER_STATUS,
  status
});
