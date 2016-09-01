import axios from 'axios';
import {FETCH_SUCCESS, FETCH_ERROR} from './ConfigActionTypes';

function fetchSuccess(data) {
  return dispatch => {
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
  return dispatch => axios.get('/config.json').then(response => {
    dispatch(fetchSuccess(response.data));
  }).catch(error => {
    dispatch(fetchError(error.response));
  });
}
