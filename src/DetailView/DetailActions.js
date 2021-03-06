import history from './../location/history';
import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_RELATION_FAILURE,
  FETCH_CANCELLED,
  CLEAR_DATA,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  UPDATE,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
  DELETE,
} from './DetailActionTypes';

export const fetch = (schemaId, params) => () => ({
  type: FETCH,
  schemaId,
  params
});

export const fetchSuccess = data => ({
  type: FETCH_SUCCESS,
  data,
});

export const fetchError = error => ({
  type: FETCH_FAILURE,
  error,
});

export const fetchRelationError = error => ({
  type: FETCH_RELATION_FAILURE,
  error,
});

export const fetchCancelled = () => ({
  type: FETCH_CANCELLED
});

export const clearData = () => dispatch => {
  dispatch({
    type: FETCH_CANCELLED
  });
  dispatch({
    type: CLEAR_DATA
  });
};

export const updateSuccess = (schemaId, params) => ({
  type: UPDATE_SUCCESS,
  schemaId,
  params,
});

export const updateError = () => ({
  type: UPDATE_FAILURE,
});

export const update = (schemaId, params) => data => ({
  type: UPDATE,
  schemaId,
  params,
  data,
});

export const removeSuccess = () => {
  history.goBack();
  return {type: DELETE_SUCCESS};
};

export const removeError = error => ({
  type: DELETE_FAILURE,
  error
});

export const remove = (schemaId, params) => () => ({
  type: DELETE,
  schemaId,
  params,
});
