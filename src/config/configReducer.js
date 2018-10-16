import {FETCH_SUCCESS, FETCH_APP_VERSION_SUCCESS} from './ConfigActionTypes';

export default function configReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        ...action.data
      };
    case FETCH_APP_VERSION_SUCCESS:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}
