import axios from 'axios';
import {
  FETCH_SUCCESS,
  FETCH_CHILD_SUCCESS,
  FETCH_FAILURE,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  CLEAR_DATA
} from './TableActionTypes';

function fetchSuccess(data) {
  return dispatch => {
    dispatch({data, type: FETCH_SUCCESS});
  };
}

function fetchError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: FETCH_FAILURE, error});
  };
}

export function fetchData(url, plural) {
  return (dispatch, getState) => {
    const state = getState();
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    axios.get(state.configReducer.gohan.url + url, {headers}).then(response => {
      dispatch(fetchSuccess(response.data[plural]));
    }).catch(error => {
      dispatch(fetchError(error.response));
    });
  };
}


function fetchChildrenSuccess(data) {
  return dispatch => {
    dispatch({data, type: FETCH_CHILD_SUCCESS});
  };
}

export function fetchChildrenData(url) {
  return (dispatch, getState) => {
    const state = getState();
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    axios.get(state.configReducer.gohan.url + url, {headers}).then(response => {
      dispatch(fetchChildrenSuccess(response.data));
    }).catch(error => {
      dispatch(fetchError(error.response));
    });
  };
}


function createSuccess(data) {
  return dispatch => {
    dispatch({data, type: CREATE_SUCCESS});
  };
}

function createError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: CREATE_FAILURE, error});
  };
}


export function createData(url, data, singular) {
  return (dispatch, getState) => {
    const state = getState();
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    axios.post(state.configReducer.gohan.url + url, data, {headers}).then(response => {
      dispatch(createSuccess(response.data[singular]));
    }).catch(error => {
      dispatch(createError(error.response));
    });
  };
}

export function clearData() {
  return dispatch => {
    dispatch({type: CLEAR_DATA});
  };
}
