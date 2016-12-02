import {FETCH_SUCCESS} from './ConfigActionTypes';

export default function configReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}
