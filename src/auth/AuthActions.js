import axios from 'axios';
import {LOGIN_SUCCESS, LOGIN_ERROR, TENANT_FETCH_SUCCESS, TENANT_FETCH_FAILURE} from './AuthActionTypes';

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

function loginSuccess(data) {
  return dispatch => {
    dispatch({data, type: LOGIN_SUCCESS});
    dispatch(fetchTenants());
  };
}

function loginFailure() {
  return dispatch => {
    const error = 'Wrong user name or password!';

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
      dispatch(loginFailure(error.response));
    });

  };
}

function selectTenantSuccess(data) {
  return dispatch => {
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
