import {
  CLEAR_FORM_DATA,
  CLEAR_ERROR,
  SHOW_ERROR,
  CLEAR_ALL_FORMS_DATA,
  PREPARE_SCHEMA_SUCCESS,
  PREPARE_SCHEMA_FAILURE,
  PREPARE_SCHEMA_START,
  OVERWRITE_SCHEMA
} from './FormActionTypes';

import {toLocalSchema, filterSchema} from '../schema/SchemaActions';


export const prepareSchemaSuccess = (formName, data) => {
  return dispatch => dispatch({
    type: PREPARE_SCHEMA_SUCCESS,
    data: {
      schema: data
    },
    formName
  });
};

export const prepareSchemaFailure = (formName, error) => {
  return dispatch => dispatch({
    type: PREPARE_SCHEMA_FAILURE,
    error: error.data ? error.data : error,
    formName
  });
};

export const prepareSchema = (formName, schema, action, parentProperty, uiSchema = {}) => {
  return async (dispatch, getState) => {
    const state = getState();

    dispatch({
      type: PREPARE_SCHEMA_START,
      formName
    });

    try {
      const resultSchema = await toLocalSchema(schema, state, parentProperty, uiSchema);

      dispatch(prepareSchemaSuccess(formName, filterSchema(resultSchema, action, parentProperty)));
    } catch (error) {
      console.error('Prepare schema for form:', formName, error);

      dispatch(prepareSchemaFailure(formName, error));
    }

  };
};

export const clearData = formName => dispatch => dispatch({type: CLEAR_FORM_DATA, formName});

export const showError = (formName, error) => dispatch => dispatch({type: SHOW_ERROR, formName, error});

export const clearError = formName => dispatch => dispatch({type: CLEAR_ERROR, formName});

export const clearAllFormsData = () => dispatch => dispatch({
  type: CLEAR_ALL_FORMS_DATA
});

export const overwriteSchema = (formName, newSchema) => dispatch => dispatch({
  type: OVERWRITE_SCHEMA,
  formName,
  data: {
    schema: newSchema
  }
});
