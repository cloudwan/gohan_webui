import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  CLEAR_DATA,
} from './apiRequestActionTypes';

export default function apiRequestReducer(
  state = {
    response: undefined,
    error: undefined,
    isLoading: false
  }, action) {
  const {data, error} = action;

  switch (action.type) {
    case FETCH:
      return {
        ...state,
        response: undefined,
        error: undefined,
        isLoading: true,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        response: data,
        isLoading: false
      };
    case FETCH_FAILURE:
      return {
        ...state,
        error,
        isLoading: false
      };
    case CLEAR_DATA:
      return {
        ...state,
        response: undefined,
        error: undefined,
        isLoading: false
      };
    default:
      return state;
  }
}
