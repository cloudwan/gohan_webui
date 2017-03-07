import axios from 'axios';
import {browserHistory} from 'react-router';
import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_CANCELLED,
  CLEAR_DATA,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  UPDATE_FAILURE,
  INIT
} from './DetailActionTypes';

export function initialize(url, singular, options) {
  return dispatch => {
    dispatch({data: {url, singular, ...options}, type: INIT});
  };
}

export function fetchData() {
  return dispatch => {
    dispatch({type: FETCH});
  };
}

export function fetchSuccess(data) {
  return {
    type: FETCH_SUCCESS,
    data
  };
}

export function fetchError(error) {
  return {
    type: FETCH_FAILURE,
    error
  };
}

export function clearData() {
  return dispatch => {
    dispatch({type: FETCH_CANCELLED});
    dispatch({type: CLEAR_DATA});
  };
}

function updateSuccess() {
  return dispatch => {
    dispatch({type: FETCH_CANCELLED});
    dispatch(fetchData());
  };
}

function updateError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        error = 'Invalid request.';
        break;
      case 404:
        error = 'Resource has not been found.';
        break;
      case 409:
        error = 'Conflict.';
    }
  } else {
    error = error.toString();
  }
  return dispatch => {
    dispatch({type: UPDATE_FAILURE, error});
  };
}

export function updateData(data) {
  return (dispatch, getState) => {
    const state = getState();
    const {url} = state.detailReducer;
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    axios.put(gohanUrl + url, data, {headers}).then(response => {
      const {status} = response;

      if (status === 200) {
        dispatch(updateSuccess());
      } else {
        dispatch(updateError('Cannot update resource!'));
      }
    }).catch(error => {
      dispatch(updateError(error));
    });
  };
}

function deleteSuccess() {
  browserHistory.goBack();
  return dispatch => {
    dispatch({type: DELETE_SUCCESS});
    dispatch({type: FETCH_CANCELLED});
  };
}

function deleteError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        error = 'Invalid request.';
        break;
      case 404:
        error = 'Resource has not been found.';
        break;
      case 409:
        error = 'Conflict.';
    }
  } else {
    error = error.toString();
  }
  return dispatch => {
    dispatch({type: DELETE_FAILURE, error});
  };
}

export function deleteData() {
  return (dispatch, getState) => {
    const state = getState();
    const {url} = state.detailReducer;
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    axios.delete(gohanUrl + url, {headers}).then(response => {

      if (response.status === 204) {
        dispatch(deleteSuccess());
      } else {
        dispatch(deleteError(response));
      }
    }).catch(error => {
      dispatch(deleteError(error));
    });
  };
}
