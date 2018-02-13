import {
  OPEN,
  CLOSE,
  CLOSE_ALL,
  PREPARE_SUCCESS,
  CLEAR_DATA,
  ERROR,
  CLEAR_ERROR,
  OVERWRITE_SCHEMA,
} from './DialogActionTypes';

export default function dialogReducer(
  state = {
    dialogs: {},
    isLoading: true,
    errorMessage: '',
    schema: undefined
  },
  action
) {
  switch (action.type) {
    case OPEN:
      return {
        ...state,
        dialogs: {
          [action.name]: true
        },
      };
    case CLOSE:
      delete state.dialogs[action.name];

      return {
        ...state,
      };
    case CLOSE_ALL:
      return {
        ...state,
        dialogs: {}
      };
    case ERROR:
      return {
        ...state,
        errorMessage: action.message,
      };
    case CLEAR_ERROR:
    return {
      ...state,
      errorMessage: '',
    };
    case PREPARE_SUCCESS:
    return {
      ...state,
      isLoading: false,
      schema: action.data
    };
    case OVERWRITE_SCHEMA:
      return {
        ...state,
        schema: action.schema
      };
    case CLEAR_DATA:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
        schema: undefined
      };
    default:
      return state;
  }
}
