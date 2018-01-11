import {
  FETCH_SUCCESS,
  CLEAR_DATA,
} from './detailViewActionTypes';

export default function detailReducer(
  state = {
    isLoading: true,
    data: {},
  }, action) {
  const {data} = action;

  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: {...data}
      };
    case CLEAR_DATA:
      return {
        isLoading: true,
        data: {}
      };
    default:
      return state;
  }
}
