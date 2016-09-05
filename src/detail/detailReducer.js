import {FETCH_SUCCESS, CLEAR_DATA} from './DetailActionTypes';

export default function configReducer(state = {}, action): Object {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        ...action.data
      };
    case CLEAR_DATA:
      return [];
    default:
      return state;
  }
}
