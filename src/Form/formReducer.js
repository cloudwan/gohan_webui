import {
  CLEAR_FORM_DATA,
  CLEAR_ERROR,
  PREPARE_SCHEMA_SUCCESS,
  CLEAR_ALL_FORMS_DATA,
  SHOW_ERROR, PREPARE_SCHEMA_START, OVERWRITE_SCHEMA
} from './FormActionTypes';

const initialState = {
  forms: {},
};

export default function formReducer(
  state = initialState,
  action
) {
  const {type, formName} = action;

  switch (type) {
    case OVERWRITE_SCHEMA:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formName]: {
            ...state.forms[formName],
            schema: action.data.schema
          }
        }
      };
    case PREPARE_SCHEMA_START:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formName]: {
            ...state.forms[formName],
            isLoading: true,
            error: ''
          }
        }
      };
    case PREPARE_SCHEMA_SUCCESS:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formName]: {
            ...state.forms[formName],
            isLoading: false,
            error: '',
            schema: action.data.schema || state.forms[formName].schema || {},
            formData: action.data.formData || {}
          }
        }
      };
    case CLEAR_FORM_DATA:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formName]: {
            ...state.forms[formName],
            formData: {}
          }
        }
      };
    case SHOW_ERROR:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formName]: {
            ...state.forms[formName],
            error: action.error
          }
        }
      };
    case CLEAR_ERROR:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formName]: {
            ...state.forms[formName],
            error: ''
          }
        }
      };
    case CLEAR_ALL_FORMS_DATA:
      return {
        ...state,
        forms: {}
      };
    default:
      return {
        ...state
      };
  }
}
