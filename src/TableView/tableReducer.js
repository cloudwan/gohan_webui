import {
  FETCH_SUCCESS,
  CLEAR_DATA,
} from './tableActionTypes';

export default function tableReducer(state = {}, action) {
  const {data} = action;

  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        [data.schemaId]: {
          isLoading: false,
          data: data.payload,
          totalCount: data.totalCount,
          limit: data.limit,
          offset: data.offset,
          sortKey: data.sortKey,
          sortOrder: data.sortOrder,
          filters: data.filters,
        }
      };
    case CLEAR_DATA:
      return {
        ...state,
        [data]: undefined
      };
    default:
      return state;
  }
}
