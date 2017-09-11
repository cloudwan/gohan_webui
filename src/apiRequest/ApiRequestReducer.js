import {
  FETCH_SUCCESS,
  FETCH_FAILURE,
  CLEAR_DATA,
} from './ApiRequestActionTypes';

export default function apiRequestReducer(
  state = {
    response: undefined,
    error: undefined,
  }, action) {
  const {data, error} = action;

  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        response: data,
      };
    case FETCH_FAILURE:
      return {
        ...state,
        error,
      };
    case CLEAR_DATA:
      return {
        ...state,
        response: undefined,
        error: undefined,
      };
    default:
      return state;
  }
}
