import {
  ERROR,
} from './../Dialog/DialogActionTypes';

import {
  EXECUTE,
  EXECUTE_SUCCESS,
  EXECUTE_FAILURE,
  CLEAR_RESPONSE
} from './CustomActionsActionTypes';

export const execute = (action, baseUrl, id, data) => {
  const url = baseUrl + action.path.replace(':id', id);

  return dispatch => dispatch({
    type: EXECUTE,
    method: action.method,
    url,
    data
  });
};

export const executeSuccess = data => ({
  type: EXECUTE_SUCCESS,
  data,
});

export const executeFailure = (error, isFromDialog) => {
  if (isFromDialog) {
    return {
      type: ERROR,
      message: error
    };
  }

  return {
    type: EXECUTE_FAILURE,
    error,
  };
};

export const clearResponse = () => dispatch => dispatch({type: CLEAR_RESPONSE});
