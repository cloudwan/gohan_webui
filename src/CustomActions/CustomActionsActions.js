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

export const execute = (action, baseUrl, id, data, responseFormat) => {
  const url = baseUrl + action.path.replace(':id', id);

  return dispatch => dispatch({
    type: EXECUTE,
    method: action.method,
    url,
    data,
    responseFormat
  });
};

export const executeSuccess = (data, url, responseFormat) => ({
  type: SUCCESS,
  data,
  title: 'The Custom Action was Successful',
  url,
  responseFormat
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
