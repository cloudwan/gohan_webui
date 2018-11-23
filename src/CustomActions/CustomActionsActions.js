import {
  ERROR,
} from './../Dialog/DialogActionTypes';

import {
  SUCCESS
} from '../SuccessToaster/SuccessToasterActionTypes';

import {
  EXECUTE,
  EXECUTE_FAILURE,
} from './CustomActionsActionTypes';

export const execute = (action, baseUrl, id, data, responseType) => {
  const url = baseUrl + action.path.replace(':id', id);

  return dispatch => dispatch({
    type: EXECUTE,
    method: action.method,
    url,
    data,
    responseType,
  });
};

export const executeSuccess = (data, format) => ({
  type: SUCCESS,
  data,
  title: 'The Custom Action was Successful',
  format,
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
