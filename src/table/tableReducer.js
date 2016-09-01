import {FETCH_SUCCESS, CLEAR_DATA} from './TableActionTypes';

export default function configReducer(state = [], action): Object {
  switch (action.type) {
    case FETCH_SUCCESS:
      return [
        ...action.data
      ];
    case CLEAR_DATA:
      return [];
    default:
      return state;
  }
}
