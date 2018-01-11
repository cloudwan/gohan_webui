import {RESET_ERROR_MESSAGE} from './errorActionTypes';

export function resetErrorMessage() {
  return dispatch => {
    dispatch({type: RESET_ERROR_MESSAGE});
  };
}
