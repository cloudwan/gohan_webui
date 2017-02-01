/* global window */
import axios from 'axios';
import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  TENANT_FETCH,
  TENANT_FETCH_SUCCESS,
  TENANT_FETCH_FAILURE
} from './AuthActionTypes';

const {sessionStorage} = window;

function fetchTenantSuccess(data) {
  return dispatch => {
    dispatch({data, type: TENANT_FETCH_SUCCESS});
  };
}

function fetchTenantFailure() {
  return dispatch => {
    const error = 'Cannot fetch tenant list!';
    dispatch({type: TENANT_FETCH_FAILURE, error});
  };
}

function fetchTenants() {
  return (dispatch, getState) => {
    const state = getState();
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    axios.get(state.configReducer.authUrl + '/tenants', {headers}).then(response => {
      dispatch(fetchTenantSuccess(response.data));
    }).catch(error => {
      dispatch(fetchTenantFailure(error.response));
    });
  };
}

export function fetchTokenData() {
  const token = sessionStorage.getItem('token');
  const tenant = sessionStorage.getItem('tenant');

  return (dispatch, getState) => {
    if (token) {
      const state = getState();
      const headers = {
        'Content-Type': 'application/json'
      };
      const data = {
        auth: {
          token: {
            id: token
          }
        }
      };

      if (tenant) {
        data.auth.tenantName = tenant;
      }

      dispatch({type: TENANT_FETCH});

      axios.post(state.configReducer.authUrl + '/tokens', data, headers).then(response => {
        dispatch(loginSuccess(response.data));
      }).catch(() => {
        dispatch(logout());
      });
    }
  };

}

function loginSuccess(data) {
  return dispatch => {

    sessionStorage.setItem('token', data.access.token.id);
    dispatch({data, type: LOGIN_SUCCESS});
    dispatch(fetchTenants());
  };
}

function loginFailure(error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        error = 'Wrong username or password!';
    }
  } else {
    error = error.toString();
  }

  return dispatch => {
    dispatch({type: LOGIN_ERROR, error});
  };
}

export function login(username, password) {
  return (dispatch, getState) => {
    const state = getState();
    const headers = {
      'Content-Type': 'application/json'
    };
    const data = {
      auth: {
        passwordCredentials: {
          username,
          password
        }
      }
    };

    axios.post(state.configReducer.authUrl + '/tokens', data, headers).then(response => {
      dispatch(loginSuccess(response.data));
    }).catch(error => {
      dispatch(loginFailure(error));
    });

  };
}

export function logout() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('scopedToken');


  return dispatch => {
    dispatch({type: LOGOUT});
  };
}

function selectTenantSuccess(data) {
  return dispatch => {
    sessionStorage.setItem('scopedToken', data.access.token.id);
    sessionStorage.setItem('tenant', data.access.token.tenant.name);

    dispatch({data, type: LOGIN_SUCCESS});
  };
}

function selectTenantFailure() {
  return dispatch => {
    const error = 'Cannot select tenant!';
    dispatch({type: LOGIN_ERROR, error});
  };
}

export function selectTenant(tenantName) {
  return (dispatch, getState) => {
    const state = getState();
    const headers = {
      'Content-Type': 'application/json'
    };

    const data = {
      auth: {
        tenantName,
        token: {
          id: state.authReducer.tokenId
        }
      }
    };

    axios.post(state.configReducer.authUrl + '/tokens', data, headers).then(response => {
      dispatch(selectTenantSuccess(response.data));
    }).catch(error => {
      dispatch(selectTenantFailure(error.response));
    });
  };
}
