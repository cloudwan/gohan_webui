import {
  OPEN,
  CLOSE,
  PREPARE_SUCCESS,
  CLEAR_DATA,
  ERROR,
  CLEAR_ERROR,
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
