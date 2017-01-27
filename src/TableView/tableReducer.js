import {
  INIT,
  FETCH_SUCCESS,
  CLEAR_DATA,
  UPDATE_SORT,
  UPDATE_OFFSET,
  UPDATE_FILTERS,
  DELETE_MULTIPLE_RESOURCES_SUCCESS
} from './TableActionTypes';

export default function tableReducer(state = {}, action) {
  const {data} = action;
  const {options} = action;

  switch (action.type) {
    case INIT:
      return {
        ...state,
        [data.plural]: {
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
          deletedMultipleResources: false,
          ...data
        }
      };
    case FETCH_SUCCESS:
      return Object.keys(data).reduce((result, key) => {
        result[key] = {
          ...state[key],
          isLoading: false,
          deletedMultipleResources: false,
          data: data[key],
          ...options
        };
        return result;
      }, {...state});
    case CLEAR_DATA:
      return {
        ...state,
        [data.plural]: undefined
      };
    case UPDATE_SORT:
      return {
        ...state,
        [data.plural]: {
          ...state[data.plural],
          sortKey: data.sortKey,
          sortOrder: data.sortOrder,
          deletedMultipleResources: false
        }
      };
    case UPDATE_OFFSET:
      return {
        ...state,
        [data.plural]: {
          ...state[data.plural],
          offset: data.offset,
          deletedMultipleResources: false
        }
      };
    case UPDATE_FILTERS:
      return {
        ...state,
        [data.plural]: {
          ...state[data.plural],
          filters: data.filters,
          deletedMultipleResources: false
        }
      };
    case DELETE_MULTIPLE_RESOURCES_SUCCESS:
      return {
        ...state,
        [data.plural]: {
          ...state[data.plural],
          deletedMultipleResources: true
        }
      };
    default:
      return state;
  }
}
