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
  user
) => {
  sessionStorage.setItem('unscopedToken', tokenId);

  return {
    type: LOGIN_SUCCESS,
    data: {
      tokenId,
      tokenExpires,
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
  domain,
});

export const scopedLoginSuccess = (
  tokenId,
  tokenExpires,
  roles,
  scope,
) => {
  sessionStorage.setItem('scopedToken', tokenId);

  return {
    type: SCOPED_LOGIN_SUCCESS,
    data: {
      tokenId,
      tokenExpires,
      roles,
      scope
    },
  };
};

export const scopedLoginFailure = error => ({
  type: SCOPED_LOGIN_ERROR,
  error,
});

export const fetchTenantSuccess = data => ({
  type: FETCH_TENANTS_SUCCESS,
  data,
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

export const fetchTokenData = () => {
  const unscopedToken = sessionStorage.getItem('unscopedToken');
  const scopedToken = sessionStorage.getItem('scopedToken');
  const tenantId = sessionStorage.getItem('tenantId');
  const tenantName = sessionStorage.getItem('tenantName');

  const tenant = (tenantId && tenantName) ?
    {id: tenantId, name: tenantName} :
    undefined;

  if (scopedToken) {
    return {
      type: CHECK_TOKEN,
      tokenId: scopedToken,
      unscopedToken,
      tenant,
    };
  }

  return clearStorage();
};

export const checkTokenSuccess = (unscopedToken, tokenId, tokenExpires, tenant, user, roles, scope) => {
  sessionStorage.setItem('scopedToken', tokenId);
  sessionStorage.setItem('unscopedToken', unscopedToken);

  return {
    type: CHECK_SUCCESS,
    data: {
      tokenId,
      unscopedToken,
      tokenExpires,
      tenant,
      user,
      roles,
      scope
    },
  };
};

export const clearStorage = () => {
  sessionStorage.removeItem('scopedToken');
  sessionStorage.removeItem('unscopedToken');
  sessionStorage.removeItem('tenantId');
  sessionStorage.removeItem('tenantName');

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

export const selectTenant = (tenant = {}) => (dispatch, getState) => {
  const state = getState();
  const roles = state.authReducer.roles || [];
  const isAdmin = roles.some(role => role.name === 'admin');
  dispatch({
    type: SELECT_TENANT,
    tenant,
  });

  if (tenant && tenant.id && tenant.name) {
    sessionStorage.setItem('tenantId', tenant.id);
    sessionStorage.setItem('tenantName', tenant.name);
  } else {
    sessionStorage.removeItem('tenantId');
    sessionStorage.removeItem('tenantName');
  }

  if (!isAdmin) {
    dispatch({
      type: SCOPED_LOGIN,
      scope: {
        project: {
          id: tenant.id,
        }
      }
    });
  }
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
