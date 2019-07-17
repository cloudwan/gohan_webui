import {
  OPEN,
  CLOSE,
  CLOSE_ALL,
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
          [action.name]: {
            show: true,
            additionalProps: action.additionalProps
          }
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
    default:
      return state;
  }
}
