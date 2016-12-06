import {RESET_ERROR_MESSAGE} from './ErrorActionTypes';

export function resetErrorMessage() {
  return dispatch => {
    dispatch({type: RESET_ERROR_MESSAGE});
  };
}
