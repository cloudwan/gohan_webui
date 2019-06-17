/* global window */
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  CHECK_TOKEN,
  CHECK_SUCCESS,
  SELECT_TENANT,
  FETCH_TENANTS_SUCCESS,
  FETCH_TENANTS_FAILURE,
  CLEAR_STORAGE,
  SHOW_TOKEN_RENEWAL,
  RENEW_TOKEN_FAILURE,
  INIT_SESSION_STORAGE_TRANSFER,
  TRANSFER_STORAGE,
  CHANGE_TENANT_FILTER_STATUS,
  SCOPED_LOGIN_SUCCESS,
  SCOPED_LOGIN_ERROR,
  FETCH_DOMAINS_SUCCESS,
  FETCH_DOMAINS_FAILURE,
  SCOPED_LOGIN,
} from './AuthActionTypes';

const {sessionStorage, localStorage, location} = window;

export const loginSuccess = (
  tokenId,
  tokenExpires,
  user,
  prefix,
  tenantFilterUseAnyOf
) => {
  sessionStorage.setItem(`${prefix}UnscopedToken`, tokenId);
  sessionStorage.setItem(`${prefix}TenantFilterUseAnyOf`, tenantFilterUseAnyOf);

  return {
    type: LOGIN_SUCCESS,
    data: {
      tokenId,
      tokenExpires,
      user,
      tenantFilterUseAnyOf
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
  domain,
});

export const loginByToken = unscopedToken => ({
  type: LOGIN,
  unscopedToken,
});

export const scopedLoginSuccess = (
  tokenId,
  tokenExpires,
  roles,
  scope,
  prefix,
  logoutTimeoutId,
  tenantFilterUseAnyOf
) => {
  sessionStorage.setItem(`${prefix}ScopedToken`, tokenId);
  sessionStorage.setItem(`${prefix}TenantFilterUseAnyOf`, tenantFilterUseAnyOf);

  return {
    type: SCOPED_LOGIN_SUCCESS,
    data: {
      tokenId,
      tokenExpires,
      roles,
      scope,
      logoutTimeoutId,
      tenantFilterUseAnyOf
    },
  };
};

export const scopedLoginFailure = error => ({
  type: SCOPED_LOGIN_ERROR,
  error,
});

export const fetchTenantSuccess = (data, isLogged) => ({
  type: FETCH_TENANTS_SUCCESS,
  data,
  isLogged,
});

export const fetchTenantFailure = error => ({
  type: FETCH_TENANTS_FAILURE,
  error,
});

export const fetchDomainsSuccess = domains => ({
  type: FETCH_DOMAINS_SUCCESS,
  domains,
});

export const fetchDomainsFailure = error => ({
  type: FETCH_DOMAINS_FAILURE,
  error,
});

export const fetchTokenData = prefix => {
  const unscopedToken = sessionStorage.getItem(`${prefix}UnscopedToken`);
  const scopedToken = sessionStorage.getItem(`${prefix}ScopedToken`);
  const tenantId = sessionStorage.getItem(`${prefix}TenantId`);
  const tenantName = sessionStorage.getItem(`${prefix}TenantName`);
  const tenantFilterStatus = sessionStorage.getItem(`${prefix}TenantFilterStatus`);
  const tenantFilterUseAnyOf = sessionStorage.getItem(`${prefix}TenantFilterUseAnyOf`);

  const tenant = (tenantId && tenantName) ?
    {id: tenantId, name: tenantName} :
    undefined;

  if (scopedToken && tenant) {
    return {
      type: CHECK_TOKEN,
      tokenId: scopedToken,
      unscopedToken,
      tenant,
      tenantFilterStatus: tenantFilterStatus === 'true',
      tenantFilterUseAnyOf: tenantFilterUseAnyOf === 'true'
    };
  }

  return clearStorage(prefix);
};

export const checkTokenSuccess = (
  unscopedToken,
  tokenId,
  tokenExpires,
  tenant,
  user,
  roles,
  scope,
  tenantFilterStatus,
  prefix,
  logoutTimeoutId,
  tenantFilterUseAnyOf
) => {
  sessionStorage.setItem(`${prefix}ScopedToken`, tokenId);
  sessionStorage.setItem(`${prefix}UnscopedToken`, unscopedToken);
  sessionStorage.setItem(`${prefix}TenantFilterStatus`, tenantFilterStatus);
  sessionStorage.setItem(`${prefix}TenantFilterUseAnyOf`, tenantFilterUseAnyOf);

  return {
    type: CHECK_SUCCESS,
    data: {
      tokenId,
      unscopedToken,
      tokenExpires,
      tenant,
      user,
      roles,
      scope,
      tenantFilterStatus,
      logoutTimeoutId,
      tenantFilterUseAnyOf
    },
  };
};

export const clearStorage = prefix => {
  sessionStorage.removeItem(`${prefix}ScopedToken`);
  sessionStorage.removeItem(`${prefix}UnscopedToken`);
  sessionStorage.removeItem(`${prefix}TenantId`);
  sessionStorage.removeItem(`${prefix}TenantName`);
  sessionStorage.removeItem(`${prefix}TenantFilterStatus`);
  sessionStorage.removeItem(`${prefix}TenantFilterUseAnyOf`);
  sessionStorage.removeItem(`${prefix}SubstringSearchEnabled`);

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
    dispatch(clearStorage(storagePrefix));
    dispatch({type: LOGOUT});

    location.reload();
  };
};

export const selectTenant = (tenant = {}) => (dispatch, getState) => {
  const state = getState();
  const {roles = [], logged} = state.authReducer;
  const {useKeystoneDomain, storagePrefix} = state.configReducer;
  const isAdmin = roles.some(role => role.name === 'admin');
  const isLogged = logged || (useKeystoneDomain && isAdmin);

  if (tenant && tenant.id && tenant.name) {
    sessionStorage.setItem(`${storagePrefix}TenantId`, tenant.id);
    sessionStorage.setItem(`${storagePrefix}TenantName`, tenant.name);
  } else {
    sessionStorage.removeItem(`${storagePrefix}TenantId`);
    sessionStorage.removeItem(`${storagePrefix}TenantName`);
  }

  if (!isAdmin || !useKeystoneDomain) {
    dispatch({
      type: SCOPED_LOGIN,
      scope: {
        project: {
          id: tenant.id,
        }
      }
    });
  }

  dispatch({
    type: SELECT_TENANT,
    tenant,
    isLogged,
  });
};

export const showTokenRenewal = () => {
  return {
    type: SHOW_TOKEN_RENEWAL
  };
};

export const renewTokenInBackground = () => (dispatch, getState) => {
  const state = getState();

  return dispatch({
    type: SCOPED_LOGIN,
    scope: state.authReducer.scope,
  });
};

export const renewToken = (username, password) => (dispatch, getState) => {
  const state = getState();
  const {scope, user} = state.authReducer;
  let identity;

  if (username !== undefined && password !== undefined) {
    identity = {
      methods: [
        'password'
      ],
      password: {
        user: {
          domain: {
            id: user.domain.id,
          },
          name: username,
          password
        }
      }
    };
  }

  return dispatch({
    type: SCOPED_LOGIN,
    scope,
    identity,
  });
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

export const changeTenantFilter = status => (dispatch, getState) => {
  const {storagePrefix} = getState().configReducer;
  sessionStorage.setItem(`${storagePrefix}TenantFilterStatus`, status);

  dispatch({
    type: CHANGE_TENANT_FILTER_STATUS,
    status
  });
};
