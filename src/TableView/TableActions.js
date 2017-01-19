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
  UPDATE_SORT,
  UPDATE_OFFSET,
  UPDATE_FAILURE,
  UPDATE_FILTERS
} from './TableActionTypes';

/**
 * Initializes resource settings like url and plural.
 *
 * @export
 * @param url {string}
 * @param plural {string}
 * @param options {object}
 * @param options.sortOrder {string}
 * @param options.sortKey {string}
 * @param options.limit {string}
 * @param options.offset {string}
 * @param options.filters {Object}
 * @return {function}
 */
export function initialize(url, plural, options) {
  if (options && options.sortOrder && !(options.sortOrder === 'asc' || options.sortOrder === 'desc')) {
    console.error('Wrong sortOrder value! Can be only asc or desc');
    options.sortOrder = undefined;
  }

  return dispatch => {
    dispatch({data: {url, plural, ...options}, type: INIT});
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
      offset: offset || undefined,
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

export function setOffset(offset) {
  return dispatch => {
    dispatch({type: UPDATE_OFFSET, data: {offset}});
    dispatch(fetchData());
  };
}

export function filterData(filters) {
  return dispatch => {
    dispatch({type: UPDATE_OFFSET, data: {offset: 0}});
    dispatch({type: UPDATE_FILTERS, data: {filters}});
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


function updateSuccess() {
  return dispatch => {
    dispatch(fetchData());
  };
}

function updateError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: UPDATE_FAILURE, error});
  };
}

/**
 * Creates new resource.
 *
 * @export
 * @param data {Object}
 * @return {function}
 */
export function updateData(id, data) {
  return (dispatch, getState) => {
    const state = getState();
    const {url} = state.tableReducer;
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    axios.put(gohanUrl + url + '/' + id, data, {headers}).then(response => {
      const {status} = response;

      if (status === 200) {
        dispatch(updateSuccess());
      } else {
        dispatch(updateError('Cannot update resource!'));
      }
    }).catch(error => {
      dispatch(updateError(error.response));
    });
  };
}

function deleteSuccess() {
  return dispatch => {
    dispatch(fetchData());
    dispatch({type: DELETE_SUCCESS});
  };
}
function deleteError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        error = 'Invalid request.';
        break;
      case 404:
        error = 'Resource has not been found.';
        break;
      case 409:
        error = 'Conflict.';
    }
  } else {
    error = error.toString();
  }
  return dispatch => {
    dispatch({type: DELETE_FAILURE, error});
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
        dispatch(deleteError(response));
      }
    }).catch(error => {
      dispatch(deleteError(error));
    });
  };
}

export function clearData() {
  return dispatch => {
    dispatch({type: CLEAR_DATA});
  };
}
