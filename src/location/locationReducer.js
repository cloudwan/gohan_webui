import {LOCATION_CHANGE} from './LocationActionsTypes';

export default function locationReducer(state = {}, action) {
  return action.type === LOCATION_CHANGE ? action.payload : state;
}
