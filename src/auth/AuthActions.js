/* global window */
import axios from 'axios';

import {
  LOGIN_INPROGRESS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  TENANT_FETCH_SUCCESS,
  TENANT_FETCH_FAILURE,
  CLEAR_STORAGE
} from './AuthActionTypes';

const {sessionStorage, location} = window;

function fetchTenantSuccess(data) {
  return dispatch => {
    dispatch({data, type: TENANT_FETCH_SUCCESS});
  };
}

function fetchTenantFailure(data) {
  const {response} = data;

  if (response) {
    const {status} = response;

    if (status === 401) {
      return dispatch => {
        dispatch({type: TENANT_FETCH_FAILURE, error: 'Please login again!'});
      };
    }

    return dispatch => {
      dispatch({type: TENANT_FETCH_FAILURE, error: `Status: ${status}. Something got wrong please, try again!`});
    };
  } else if (data.message) {
    return dispatch => {
      dispatch({type: TENANT_FETCH_FAILURE, error: `${data.message}!`});
    };
  }

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
      dispatch(fetchTenantFailure(error));
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

      axios.post(state.configReducer.authUrl + '/tokens', data, headers).then(response => {
        dispatch(loginSuccess(response.data));
      }).catch(() => {
        dispatch(clearStorage());
      });
    } else {
      dispatch(clearStorage());
    }
  };

}

function inProgress() {
  return dispatch => {
    dispatch({type: LOGIN_INPROGRESS});
  };
}


function loginSuccess(data) {
  return dispatch => {

    sessionStorage.setItem('token', data.access.token.id);
    dispatch({data, type: LOGIN_SUCCESS});
    dispatch(fetchTenants());
  };
}

function loginFailure(data) {
  const {response} = data;

  if (response) {
    const {status} = response;

    if (status === 400) {
      return dispatch => {
        dispatch({type: LOGIN_ERROR, error: 'Please enter login and password!'});
      };
    } else if (status === 401) {
      return dispatch => {
        dispatch({type: LOGIN_ERROR, error: 'Please enter correct login and password!'});
      };
    }

    return dispatch => {
      dispatch({type: LOGIN_ERROR, error: `Status: ${status}. Something got wrong please, try again!`});
    };
  } else if (data.message) {
    return dispatch => {
      dispatch({type: LOGIN_ERROR, error: `${data.message}!`});
    };
  }

  return dispatch => {
    dispatch({type: LOGIN_ERROR, error: 'Unknown Error!'});
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

    dispatch(inProgress());
    axios.post(state.configReducer.authUrl + '/tokens', data, headers).then(response => {
      dispatch(loginSuccess(response.data));
    }).catch(error => {
      dispatch(loginFailure(error));
    });
  };
}

export function clearStorage() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('scopedToken');
  sessionStorage.removeItem('tenant');

  return dispatch => {
    dispatch({type: CLEAR_STORAGE});
  };
}

export function logout() {
  return dispatch => {
    dispatch(clearStorage());
    dispatch({type: LOGOUT});
    location.reload();
  };
}

function selectTenantSuccess(data) {
  return dispatch => {
    sessionStorage.setItem('scopedToken', data.access.token.id);
    sessionStorage.setItem('tenant', data.access.token.tenant.name);

    dispatch({data, type: LOGIN_SUCCESS});
  };
}

function selectTenantFailure(data) {
  const {response} = data;

  if (response) {
    const {status} = response;

    if (status === 401) {
      return dispatch => {
        dispatch({type: LOGIN_ERROR, error: 'Cannot select tenant!'});
      };
    }
    return dispatch => {
      dispatch({type: LOGIN_ERROR, error: `Status: ${status}. Something got wrong please, try again!`});
    };

  } else if (data.message) {
    return dispatch => {
      dispatch({type: LOGIN_ERROR, error: `${data.message}!`});
    };
  }

  return dispatch => {
    dispatch({type: LOGIN_ERROR, error: 'Unknown Error!'});
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
    dispatch(inProgress());
    axios.post(state.configReducer.authUrl + '/tokens', data, headers).then(response => {
      dispatch(selectTenantSuccess(response.data));
    }).catch(error => {
      dispatch(selectTenantFailure(error));
    });
  };
}
