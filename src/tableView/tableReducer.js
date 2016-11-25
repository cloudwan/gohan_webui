import {
  INIT,
  FETCH_SUCCESS,
  CLEAR_DATA,
  UPDATE_SORT
} from './TableActionTypes';

export default function tableReducer(
  state = {
    isLoading: true,
    url: '',
    plural: '',
    data: [],
    totalCount: 0,
    limit: undefined,
    offset: undefined,
    sortKey: undefined,
    sortOrder: undefined,
    filters: {}
  }, action) {
  const {data} = action;
  const {options} = action;

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
        data,
        ...options
      };
    case CLEAR_DATA:
      return {
        isLoading: true,
        data: [],
        children: {},
        polling: false
      };
    case UPDATE_SORT:
      return {
        ...state,
        ...data
      };
    default:
      return state;
  }
}
