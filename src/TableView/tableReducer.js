import {
  FETCH_SUCCESS,
  PURGE,
  CLEAR_DATA,
} from './TableActionTypes';

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
    case PURGE:
      return {
        ...state,
        [action.schemaId]: {
          ...state[action.schemaId],
          data: state[action.schemaId].data.map(item => {
            if (action.id.includes(item.id)) {
              return {
                ...item,
                deleting: true
              };
            }

            return item;
          })
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
