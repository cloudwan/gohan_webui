import {LOCATION_CHANGE} from './locationActionTypes';

export default function locationReducer(state = {}, action) {
  return action.type === LOCATION_CHANGE ? action.payload : state;
}
