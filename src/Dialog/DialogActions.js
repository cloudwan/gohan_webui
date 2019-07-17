import {
  OPEN,
  CLOSE,
  CLOSE_ALL,
  ERROR,
  CLEAR_ERROR,
  CLEAR_DATA
} from './DialogActionTypes';

export function clearData() {
  return dispatch => {
    dispatch({type: CLEAR_DATA});
  };
}

export const openDialog = name => additionalProps => dispatch => dispatch(
  {
    type: OPEN,
    name,
    additionalProps
  }
);

export const closeDialog = name => () => ({
  type: CLOSE,
  name
});

export const closeActiveDialog = () => ({type: CLOSE_ALL});

export const clearError = () => dispatch => dispatch(
  {
    type: CLEAR_ERROR,
  }
);

export const showError = message => ({
  type: ERROR,
  message
});
