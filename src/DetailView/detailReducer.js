import {
  FETCH_SUCCESS,
  CLEAR_DATA,
  DELETE_SUCCESS,
  INIT
} from './DetailActionTypes';

export default function detailReducer(
  state = {
    isLoading: true,
    data: {},
    polling: false
  }, action) {
  const {data} = action;

  switch (action.type) {
    case INIT:
      return {
        ...state,
        ...data
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data
      };
    case CLEAR_DATA:
      return {
        isLoading: true,
        data: {},
        children: {},
        polling: false
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        data: {...state.data, ...data}
      };
    default:
      return state;
  }
}
