import axios from 'axios';
import {FETCH_SUCCESS, FETCH_FAILURE, CLEAR_DATA} from './TableActionTypes';

function fetchSuccess(data) {
  return dispatch => {
    dispatch({data, type: FETCH_SUCCESS});
  };
}

function fetchError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: FETCH_FAILURE, error});
  };
}

export function fetchData(url, plural) {
  return (dispatch, getState) => {
    const state = getState();
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    axios.get(state.configReducer.gohan.url + url, {headers}).then(response => {
      dispatch(fetchSuccess(response.data[plural]));
    }).catch(error => {
      dispatch(fetchError(error.response));
    });
  };
}

export function clearData() {
  return dispatch => {
    dispatch({type: CLEAR_DATA});
  };
}
