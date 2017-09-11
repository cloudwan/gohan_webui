import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  CLEAR_DATA,
} from './ApiRequestActionTypes';

export const fetch = (method, url, body) => dispatch => dispatch({
  type: FETCH,
  method,
  url,
  body,
});

export const fetchSuccess = data => ({
  type: FETCH_SUCCESS,
  data,
});

export const fetchFailure = error => ({
  type: FETCH_FAILURE,
  error,
});

export const clearData = () => dispatch => dispatch({type: CLEAR_DATA});
