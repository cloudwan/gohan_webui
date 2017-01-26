import {
  FETCH_SUCCESS,
  FETCH_CHILD_SUCCESS,
  CLEAR_DATA,
  CREATE_SUCCESS,
  POLLING_DATA,
  CANCEL_POLLING_DATA,
  DELETE_SUCCESS,
  INIT
} from './DetailActionTypes';

export default function detailReducer(
  state = {
    isLoading: true,
    data: {},
    children: {},
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
    case FETCH_CHILD_SUCCESS:
      return {
        ...state,
        children: {
          ...state.children,
          ...data
        }
      };
    case CLEAR_DATA:
      return {
        isLoading: true,
        data: {},
        children: {},
        polling: false
      };
    case CREATE_SUCCESS:
      return {
        ...state,
        data: {...state.data, ...data}
      };
    case POLLING_DATA:
      return {
        ...state,
        polling: true,
        data: {...state.data, ...data}
      };
    case CANCEL_POLLING_DATA:
      return {
        ...state,
        data: {...state.data, ...data}
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
