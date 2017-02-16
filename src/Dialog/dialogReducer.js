import {PREPARE_SUCCESS, CLEAR_DATA} from './DialogActionTypes';

export default function dialogReducer(state = {isLoading: true, schema: undefined}, action) {
  switch (action.type) {
    case PREPARE_SUCCESS:
      return {
        isLoading: false,
        schema: action.data
      };
    case CLEAR_DATA:
      return {
        isLoading: true,
        schema: undefined
      };
    default:
      return state;
  }
}
