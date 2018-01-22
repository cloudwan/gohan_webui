/* global  */
import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
} from './UiSchemaActionTypes';

export const fetchSuccess = data => ({
  type: FETCH_SUCCESS,
  data,
});

export const fetchFailure = error => ({
  type: FETCH_FAILURE,
  error,
});

export const fetch = () => ({
  type: FETCH,
});
