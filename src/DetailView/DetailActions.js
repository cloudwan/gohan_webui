import {browserHistory} from 'react-router';
import {
  put,
  purge,
  parseXHRError
} from './../api/index';
import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_CANCELLED,
  CLEAR_DATA,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  UPDATE_FAILURE,
} from './DetailActionTypes';

import {showError} from './../Dialog/DialogActions';

export const fetch = url => () => dispatch => dispatch({
  type: FETCH,
  url,
});

export const fetchSuccess = data => ({
  type: FETCH_SUCCESS,
  data,
});

export const fetchError = error => ({
  type: FETCH_FAILURE,
  error,
});

export const clearData = () => dispatch => {
  dispatch({
    type: FETCH_CANCELLED
  });
  dispatch({
    type: CLEAR_DATA
  });
};

export const updateSuccess = url => dispatch => dispatch(fetch(url)());

export const updateError = error => dispatch => {
  dispatch({
    type: UPDATE_FAILURE,
  });
  dispatch(showError(error));
};

export const update = url => (data, successCb, errorCb) => {
  return (dispatch, getState) => {
    const state = getState();
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    put(gohanUrl + url, headers, data).subscribe(response => {
      const {status} = response;

      if (status === 200) {
        dispatch(updateSuccess(url));
        if (successCb) {
          successCb();
        }
      } else {
        dispatch(updateError(parseXHRError(response)));
        if (errorCb) {
          errorCb();
        }
      }
    }, error => {
      dispatch(updateError(parseXHRError(error)));
      if (errorCb) {
        errorCb();
      }
    });
  };
};

export const removeSuccess = () => {
  browserHistory.goBack();
  return dispatch => {
    dispatch({type: DELETE_SUCCESS});
    dispatch({type: FETCH_CANCELLED});
  };
};

export const removeError = error => dispatch => dispatch({
  type: DELETE_FAILURE,
  error
});

export const remove = url => () => {
  return (dispatch, getState) => {
    const state = getState();
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    purge(gohanUrl + url, headers).subscribe(
      response => {
        if (response.status === 204) {
          dispatch(removeSuccess());
        } else {
          dispatch(removeError(parseXHRError(response)));
        }
      },
      error => {
        dispatch(removeError(parseXHRError(error)));
      }
    );
  };
};
