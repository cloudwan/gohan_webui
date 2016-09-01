/* global location */
import {FETCH_SUCCESS} from './ConfigActionTypes';

export default function configReducer(state = {}, action): Object {
  switch (action.type) {
    case FETCH_SUCCESS:
      if (action.data.authUrl.includes('__HOST__')) {
        action.data.authUrl = action.data.authUrl.replace(
        '__HOST__', location.hostname);
      }

      if (action.data.gohan.url.includes('__HOST__')) {
        action.data.gohan.url = action.data.gohan.url.replace(
          '__HOST__', location.hostname);
      }

      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}
