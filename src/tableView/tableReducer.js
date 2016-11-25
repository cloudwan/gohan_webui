import {INIT, FETCH_SUCCESS, CLEAR_DATA} from './TableActionTypes';

export default function tableReducer(
  state = {
    isLoading: true,
    url: '',
    plural: '',
    data: [],
    totalCount: 0,
    offset: 0,
    limit: 0,
    sortKey: '',
    sortOrder: '',
    filters: [],
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
    default:
      return state;
  }
}
