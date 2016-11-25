import axios from 'axios';
import {
  INIT,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  CLEAR_DATA,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  UPDATE_SORT
} from './TableActionTypes';

/**
 * Initializes resource settings like url and plural.
 *
 * @export
 * @param url {string}
 * @param plural {string}
 * @param singular {string}
 * @return {function}
 */
export function initialize(url, plural) {
  return dispatch => {
    dispatch({data: {url, plural}, type: INIT});
  };
}

function fetchSuccess(data, options) {
  return dispatch => {
    dispatch({data, options, type: FETCH_SUCCESS});
  };
}

function fetchError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: FETCH_FAILURE, error});
  };
}

/**
 * Starts fetch data for table resource.
 *
 * @export
 * @return {function}
 */
export function fetchData() {
  return (dispatch, getState) => {
    const state = getState();
    const {
      url,
      plural,
      limit,
      offset,
      sortKey,
      sortOrder,
      filters
    } = state.tableReducer;
    const {pageLimit} = state.configReducer;
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };
    const params = {
      offset,
      limit: limit || pageLimit,
      sort_key: sortKey,         // eslint-disable-line
      sort_order: sortOrder,     // eslint-disable-line
      ...filters
    };

    axios.get(gohanUrl + url, {headers, params}).then(response => {
      const {headers, status, data} = response;
      const totalCount = headers['x-total-count'];

      if (status === 200) {
        dispatch(fetchSuccess(data[plural], {totalCount}));
      } else {
        dispatch(fetchError('Cannot fetch data!'));
      }
    }).catch(error => {
      dispatch(fetchError(error.response));
    });
  };
}

export function sortData(sortKey, sortOrder) {
  if (sortOrder && sortOrder !== 'asc' && sortOrder !== 'desc') {
    return dispatch => {
      dispatch({type: 'error', error: 'Sort order must by asc or desc'});
    };
  }

  return dispatch => {
    dispatch({type: UPDATE_SORT, data: {sortKey, sortOrder}});
    dispatch(fetchData());
  };
}

function createSuccess() {
  return dispatch => {
    dispatch(fetchData());
    dispatch({type: CREATE_SUCCESS});
  };
}

function createError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: CREATE_FAILURE, error});
  };
}

/**
 * Creates new resource.
 *
 * @export
 * @param data {Object}
 * @return {function}
 */
export function createData(data) {
  return (dispatch, getState) => {
    const state = getState();
    const {url} = state.tableReducer;
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    axios.post(gohanUrl + url, data, {headers}).then(response => {
      const {status} = response;

      if (status === 201) {
        dispatch(createSuccess());
      } else {
        dispatch(createError('Cannot create new resource!'));
      }
    }).catch(error => {
      dispatch(createError(error.response));
    });
  };
}

export function deleteData(url, id) {
  return (dispatch, getState) => {
    const state = getState();
    const {url} = state.tableReducer;
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;

    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    axios.delete(gohanUrl + url + '/' + id, {headers}).then(response => {
      const {status} = response;

      if (status === 204) {
        dispatch(deleteSuccess());
      } else {
        dispatch(deleteError('Cannot remove this resource!'));
      }
    }).catch(error => {
      dispatch(deleteError(error.response));
    });
  };
}

function deleteSuccess() {
  return dispatch => {
    dispatch(fetchData());
    dispatch({type: DELETE_SUCCESS});
  };
}
function deleteError() {
  return dispatch => {
    dispatch({type: DELETE_FAILURE});
  };
}

export function clearData() {
  return dispatch => {
    dispatch({type: CLEAR_DATA});
  };
}
