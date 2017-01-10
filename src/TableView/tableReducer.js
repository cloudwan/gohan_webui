import {
  INIT,
  FETCH_SUCCESS,
  CLEAR_DATA,
  UPDATE_SORT,
  UPDATE_OFFSET,
  UPDATE_FILTERS,
  DELETE_MULTIPLE_RESOURCES_SUCCESS
} from './TableActionTypes';

export default function tableReducer(
  state = {
    isLoading: true,
    url: '',
    plural: '',
    data: [],
    totalCount: 0,
    offset: 0,
    limit: undefined,
    sortKey: undefined,
    sortOrder: undefined,
    filters: {},
    deletedMultipleResources: undefined
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
        ...options,
        deletedMultipleResources: undefined
      };
    case CLEAR_DATA:
      return {
        isLoading: true,
        url: '',
        plural: '',
        data: [],
        totalCount: 0,
        offset: 0,
        limit: undefined,
        sortKey: undefined,
        sortOrder: undefined,
        filters: {},
        deletedMultipleResources: undefined
      };
    case UPDATE_SORT:
      return {
        ...state,
        ...data,
        deletedMultipleResources: undefined
      };
    case UPDATE_OFFSET:
      return {
        ...state,
        ...data,
        deletedMultipleResources: undefined
      };
    case UPDATE_FILTERS:
      return {
        ...state,
        ...data,
        deletedMultipleResources: undefined
      };
    case DELETE_MULTIPLE_RESOURCES_SUCCESS:
      return {
        ...state,
        ...data,
        deletedMultipleResources: true
      };
    default:
      return state;
  }
}
