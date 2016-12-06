import axios from 'axios';
import {FETCH_SUCCESS, FETCH_ERROR} from './SchemaActionTypes';

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

export function fetchSchema() {
  return (dispatch, getState) => {
    const state = getState();
    const url = state.configReducer.gohan.url + state.configReducer.gohan.schema;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };


    return axios.get(url, {headers}).then(response => {
      dispatch(fetchSuccess(response.data.schemas));
    }).catch(error => {
      dispatch(fetchError(error.response));
    });
  };
}
