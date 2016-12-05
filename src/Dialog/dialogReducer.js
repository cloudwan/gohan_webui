import {FETCH_SUCCESS, CLEAR_DATA} from './DialogActionTypes';

export default function dialogReducer(state = {isLoading: true, schema: undefined}, action) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
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
