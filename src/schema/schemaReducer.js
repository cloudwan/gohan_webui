import {FETCH_SUCCESS} from './SchemaActionTypes';

export default function schemaReducer(
  state = {
    isLoading: true,
    data: {}
  },
  action) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        isLoading: false,
        data: [...action.data]
      };
    default:
      return state;
  }
}
