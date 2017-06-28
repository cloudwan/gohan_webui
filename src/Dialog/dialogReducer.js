import {
  OPEN,
  CLOSE,
  PREPARE_SUCCESS,
  CLEAR_DATA
} from './DialogActionTypes';

export default function dialogReducer(
  state = {
    dialogs: {},
    isLoading: true,
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
        schema: undefined
      };
    default:
      return state;
  }
}
