import {
  OPEN,
  CLOSE,
  CLOSE_ALL,
  PREPARE_SUCCESS,
  PREPARE_FAILURE,
  ERROR,
  CLEAR_ERROR,
  CLEAR_DATA,
  OVERWRITE_SCHEMA
} from './DialogActionTypes';

import {
  toLocalSchema,
  filterSchema
} from '../schema/SchemaActions';

function fetchSuccess(data) {
  return dispatch => {
    dispatch({data, type: PREPARE_SUCCESS});
  };
}

function fetchError(error) {
  return dispatch => {
    if (error.data) {
      dispatch({type: PREPARE_FAILURE, error: error.data});
    } else {
      dispatch({type: PREPARE_FAILURE, error});
    }
  };
}

export function prepareSchema(schema, action, parentProperty, uiSchema = {}) {
  return async (dispatch, getState) => {
    const state = getState();

    try {
      const resultSchema = await toLocalSchema(schema, state, parentProperty, uiSchema);

      dispatch(fetchSuccess(filterSchema(resultSchema, action, parentProperty)));
    } catch (error) {
      console.error(error);
      dispatch(fetchError(error));
    }

  };
}

export function clearData() {
  return dispatch => {
    dispatch({type: CLEAR_DATA});
  };
}

export const openDialog = name => () => dispatch => dispatch(
  {
    type: OPEN,
    name
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

export const overwriteSchema = schema => dispatch => dispatch({
  type: OVERWRITE_SCHEMA,
  schema
});
