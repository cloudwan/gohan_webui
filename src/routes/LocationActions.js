import {LOCATION_CHANGE} from './LocationActionsTypes';

export function locationChange(location = '/') {
  return {
    type: LOCATION_CHANGE,
    payload: location
  };
}
export function updateLocation({dispatch}) {
  return nextLocation => dispatch(locationChange(nextLocation));
}
