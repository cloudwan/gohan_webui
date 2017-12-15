/* global location, document */
import axios from 'axios';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  SET_TITLE
} from './ConfigActionTypes';

function fetchSuccess(data) {
  return dispatch => {
    if (data.authUrl.includes('__HOST__')) {
      data.authUrl = data.authUrl.replace(
        '__HOST__', location.hostname);
    }

    if (data.gohan.url.includes('__HOST__')) {
      data.gohan.url = data.gohan.url.replace(
        '__HOST__', location.hostname);
    }

    dispatch({data, type: FETCH_SUCCESS});
  };
}

function fetchError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: FETCH_ERROR, error});
  };
}

export function fetchConfig() {
  return dispatch => axios.get('./config.json').then(response => {
    dispatch(fetchSuccess(response.data));
  }).catch(error => {
    dispatch(fetchError(error.response));
  });
}

export function setTitle(firstPart) {
  return (dispatch, getState) => {
    const {title} = getState().configReducer;

    document.title = `${firstPart} | ${title}`;

    dispatch({
      type: SET_TITLE
    });
  };
}
