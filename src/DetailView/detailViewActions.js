import history from './../location/history';
import {
  put,
  purge,
  parseXHRError
} from './../api/index';
import {getSingularUrl} from './../schema/schemaSelectors';
import {
  FETCH,
  FETCH_PARENTS,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_CANCELLED,
  CLEAR_DATA,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  UPDATE_FAILURE,
} from './detailViewActionTypes';

import {showError} from './../Dialog/dialogActions';

export const fetch = (schemaId, params) => () => dispatch => dispatch({
  type: FETCH,
  schemaId,
  params
});

export const fetchParents = (data, withParents) => ({
  type: FETCH_PARENTS,
  data,
  withParents,
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

export const updateSuccess = (schemaId, params) => dispatch => dispatch(fetch(schemaId, params)());

export const updateError = error => dispatch => {
  dispatch({
    type: UPDATE_FAILURE,
  });
  dispatch(showError(error));
};

export const update = (schemaId, params) => (data, successCb, errorCb) => {
  return (dispatch, getState) => {
    const state = getState();
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };
    const url = getSingularUrl(state, schemaId, params);

    put(gohanUrl + url, headers, data).subscribe(response => {
      const {status} = response;

      if (status === 200) {
        dispatch(updateSuccess(schemaId, params));
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
  history.goBack();
  return dispatch => {
    dispatch({type: DELETE_SUCCESS});
    dispatch({type: FETCH_CANCELLED});
  };
};

export const removeError = error => dispatch => dispatch({
  type: DELETE_FAILURE,
  error
});

export const remove = (schemaId, params) => () => {
  return (dispatch, getState) => {
    const state = getState();
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };
    const url = getSingularUrl(state, schemaId, params);

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
