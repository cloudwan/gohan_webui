import axios from 'axios';
import {browserHistory} from 'react-router';
import {
  FETCH_SUCCESS,
  FETCH_CHILD_SUCCESS,
  FETCH_FAILURE,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  CLEAR_DATA,
  POLLING_DATA,
  CANCEL_POLLING_DATA,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  UPDATE_FAILURE,
  INIT
} from './DetailActionTypes';

let timeoutId = null;

export function initialize(url, singular, options) {
  return dispatch => {
    dispatch({data: {url, singular, ...options}, type: INIT});
  };
}

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

export function fetchData(polling) {
  return (dispatch, getState) => {
    const state = getState();
    const {url, singular} = state.detailReducer;
    const {url: gohanUrl} = state.configReducer.gohan;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    axios.get(gohanUrl + url, {headers}).then(response => {
      dispatch(fetchSuccess(response.data[singular]));
      if (polling) {
        dispatch(pollData(url, singular));
      }
    }).catch(error => {
      if (axios.isCancel(error)) {
        clearTimeout(timeoutId);
      } else {
        dispatch(fetchError(error.response));
        if (polling) {
          dispatch(pollData(url, singular));
        }
      }
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

export function pollData(url, quantity, sourceToken) {
  return dispatch => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      dispatch({type: POLLING_DATA});
      dispatch(fetchData(url, quantity, sourceToken, true));
    }, 10000);
  };
}

export function cancelPollData() {
  return dispatch => {
    clearTimeout(timeoutId);
    dispatch({type: CANCEL_POLLING_DATA});
  };
}

function updateSuccess() {
  return dispatch => {
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
