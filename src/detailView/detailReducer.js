import {FETCH_SUCCESS, FETCH_CHILD_SUCCESS, CLEAR_DATA} from './DetailActionTypes';

export default function dynamicReducer(
  state = {
    isLoading: true,
    data: {},
    children: {},
    polling: false
  }, action) {
  const {data} = action;

  switch (action.type) {
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
    default:
      return state;
  }
}
