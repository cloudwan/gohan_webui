import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_CANCELLED,
  CREATE,
  CREATE_SUCCESS,
  CLEAR_DATA,
  PURGE,
  PURGE_SUCCESS,
  PURGE_FAILURE,
  UPDATE,
  UPDATE_SUCCESS,
} from './tableActionTypes';

import {showError} from './../Dialog/dialogActions';

export const fetch = (schemaId, params) => options => ({
  type: FETCH,
  schemaId,
  params,
  options
});

export const fetchSuccess = data => ({
  type: FETCH_SUCCESS,
  data
});

export const fetchFailure = errorMsg => ({
  type: FETCH_FAILURE,
  error: errorMsg
});

export const cancelFetch = schemaId => () => ({
  type: FETCH_CANCELLED,
  schemaId
});


export const createSuccess = () => ({
  type: CREATE_SUCCESS
});

export const createFailure = error => showError(error);

export const create = (schemaId, params) => data => ({
  type: CREATE,
  schemaId,
  params,
  data
});

export const update = (schemaId, params) => (data, id) => ({
  type: UPDATE,
  schemaId,
  params,
  data,
  id
});


export const updateSuccess = () => ({
  type: UPDATE_SUCCESS
});

export const updateFailure = error => showError(error);

export const purge = (schemaId, params) => id => ({
  type: PURGE,
  schemaId,
  params,
  id
});

export const purgeSuccess = () => ({
  type: PURGE_SUCCESS
});

export const purgeFailure = error => ({
  type: PURGE_FAILURE,
  error
});

export const clear = schemaId => () => ({
  type: CLEAR_DATA,
  data: schemaId
});
