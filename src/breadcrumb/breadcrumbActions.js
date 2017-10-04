import {
  UPDATE,
  UPDATE_FULFILLED,
  UPDATE_FAILURE,
} from './breadcrumbActionTypes.js';

export const update = data => dispatch => dispatch({
  type: UPDATE,
  data,
});

export const updateFulfilled = data => ({
  type: UPDATE_FULFILLED,
  data,
});

export const updateFailure = error => ({
  type: UPDATE_FAILURE,
  error,
});
