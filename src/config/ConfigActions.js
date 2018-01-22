/* global document */
import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  SET_TITLE
} from './ConfigActionTypes';

export const fetchSuccess = data => ({
  type: FETCH_SUCCESS,
  data,
});

export const fetchFailure = error => ({
  type: FETCH_FAILURE,
  error,
});

export const fetch = () => ({
  type: FETCH,
});

export function setTitle(firstPart) {
  return (dispatch, getState) => {
    const {title} = getState().configReducer;

    document.title = `${firstPart} | ${title}`;

    dispatch({
      type: SET_TITLE
    });
  };
}
