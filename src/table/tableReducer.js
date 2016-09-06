import {FETCH_SUCCESS, CLEAR_DATA, CREATE_SUCCESS} from './TableActionTypes';

export default function tableReducer(state = [], action): Object {
  switch (action.type) {
    case FETCH_SUCCESS:
      return [
        ...action.data
      ];
    case CREATE_SUCCESS:
      return [
        ...state,
        action.data
      ];
    case CLEAR_DATA:
      return [];
    default:
      return state;
  }
}
