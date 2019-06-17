import {FETCH_SUCCESS, FETCH_APP_VERSION_SUCCESS, SET_SUBSTRING_SEARCH_ENABLED} from './ConfigActionTypes';

export default function configReducer(state = {
  substringSearchEnabled: true
}, action) {
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
    case SET_SUBSTRING_SEARCH_ENABLED:
      return {
        ...state,
        substringSearchEnabled: action.data
      };
    default:
      return state;
  }
}
