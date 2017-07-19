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
  UPDATE_SORT_ERROR,
  UPDATE_OFFSET,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
  UPDATE_FILTERS,
  DELETE_MULTIPLE_RESOURCES_SUCCESS
} from './TableActionTypes';

import {showError} from './../Dialog/DialogActions';

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
    delete options.sortOrder;
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
    const {error} = data;

    dispatch({type: FETCH_FAILURE, error});
  };
}

/**
 * Starts fetch data for table resource.
 *
 * @export
 * @param {string} plural
 * @return {function}
 */
export function fetchData(plural) {
  return (dispatch, getState) => {
    const state = getState();
    const {
      url,
      limit,
      offset,
      sortKey,
      sortOrder,
      filters
    } = state.tableReducer[plural];
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

      if (status === 200) {
        const totalCount = headers['x-total-count'];
        dispatch(fetchSuccess(data, {totalCount}));
      } else {
        dispatch(fetchError({error: 'Cannot fetch data!'}));
      }
    }).catch(error => {
      if (error.response) {
        dispatch(fetchError({error: error.response.data}));
      } else {
        dispatch(fetchError({error: error.message}));
      }
    });
  };
}

/**
 * Sets sort options and fetches data.
 *
 * @export
 * @param {string} sortKey
 * @param {string} sortOrder - asc or desc
 * @param {string} plural
 * @return {function}
 */
export function sortData(sortKey, sortOrder, plural) {
  if (sortOrder && sortOrder !== 'asc' && sortOrder !== 'desc') {
    return dispatch => {
      dispatch({type: UPDATE_SORT_ERROR, error: 'Sort order must by asc or desc!'});
    };
  }

  return dispatch => {
    dispatch({type: UPDATE_SORT, data: {plural, sortKey, sortOrder}});
    dispatch(fetchData(plural));
  };
}

/**
 * Sets offset and fetches data.
 *
 * @export
 * @param {number} offset
 * @param {string} plural
 * @return {function}
 */
export function setOffset(offset, plural) {
  return dispatch => {
    dispatch({type: UPDATE_OFFSET, data: {plural, offset}});
    dispatch(fetchData(plural));
  };
}

/**
 * Filters data by specified property and value.
 *
 * @export
 * @param {{[string]: string}} filters
 * @param {string} plural
 * @return {function}
 */
export function filterData(filters, plural) {
  return dispatch => {
    dispatch({type: UPDATE_OFFSET, data: {plural, offset: 0}});
    dispatch({type: UPDATE_FILTERS, data: {plural, filters}});
    dispatch(fetchData(plural));
  };
}

function createSuccess(plural) {
  return dispatch => {
    dispatch(fetchData(plural));
    dispatch({type: CREATE_SUCCESS});
  };
}

function createError(data) {
  return dispatch => {
    const {error} = data.data;

    dispatch({type: CREATE_FAILURE});
    dispatch(showError(error));
  };
}

/**
 * Creates new resource.
 *
 * @export
 * @param data {Object}
 * @param plural {string}
 * @return {function}
 */
export function createData(data, plural, successCb, errorCb) {
  return (dispatch, getState) => {
    const state = getState();
    const {url} = state.tableReducer[plural];
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    axios.post(gohanUrl + url, data, {headers}).then(response => {
      const {status} = response;

      if (status === 201) {
        dispatch(createSuccess(plural));
        if (successCb) {
          successCb();
        }
      } else {
        dispatch(createError({data: {error: 'Cannot create new resource!'}}));
        if (errorCb) {
          errorCb();
        }
      }
    }).catch(error => {
      dispatch(createError(error.response));
      if (errorCb) {
        errorCb();
      }
    });
  };
}


function updateSuccess(plural) {
  return dispatch => {
    dispatch(fetchData(plural));
    dispatch({type: UPDATE_SUCCESS});

  };
}

function updateError(data) {
  return dispatch => {
    const {error} = data.data;

    dispatch({type: UPDATE_FAILURE});
    dispatch(showError(error));
  };
}

/**
 * Creates new resource.
 *
 * @export
 * @param id {string}
 * @param data {Object}
 * @param plural {string}
 * @return {function}
 */
export function updateData(id, data, plural, successCb, errorCb) {
  return (dispatch, getState) => {
    const state = getState();
    const {url} = state.tableReducer[plural];
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    axios.put(gohanUrl + url + '/' + id, data, {headers}).then(response => {
      const {status} = response;

      if (status === 200) {
        dispatch(updateSuccess(plural));
        if (successCb) {
          successCb();
        }
      } else {
        dispatch(updateError({data: {error: 'Cannot update resource!'}}));
        if (errorCb) {
          errorCb();
        }
      }
    }).catch(error => {
      dispatch(updateError(error.response));
      if (errorCb) {
        errorCb();
      }
    });
  };
}

function deleteSuccess(plural) {
  return dispatch => {
    dispatch(fetchData(plural));
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

/**
 * Removes resource and fetches data.
 *
 * @export
 * @param {string} id
 * @param {string} plural
 * @return {function}
 */
export function deleteData(id, plural) {
  return (dispatch, getState) => {
    const state = getState();
    const {url} = state.tableReducer[plural];
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;

    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };

    axios.delete(gohanUrl + url + '/' + id, {headers}).then(response => {
      const {status} = response;

      if (status === 204) {
        dispatch(deleteSuccess(plural));
      } else {
        dispatch(deleteError(response));
      }
    }).catch(error => {
      dispatch(deleteError(error));
    });
  };
}

function deleteMultipleResourcesSuccess(plural) {
  return dispatch => {
    dispatch(fetchData(plural));
    dispatch({type: DELETE_MULTIPLE_RESOURCES_SUCCESS, data: {plural}});
  };
}

/**
 * Removes array of resources.
 *
 * @param {[string]} ids
 * @param {string} plural
 * @return {function}
 */
export function deleteMultipleResources(ids, plural) {
  return (dispatch, getState) => {
    const state = getState();
    const {url} = state.tableReducer[plural];
    const {url: gohanUrl} = state.configReducer.gohan;
    const {tokenId} = state.authReducer;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': tokenId
    };
    let requests = [];

    ids.forEach(id => {
      requests.push(axios.delete(gohanUrl + url + '/' + id, {headers}));
    });

    axios.all(requests)
      .then(() => {
        dispatch(deleteMultipleResourcesSuccess(plural));
      })
      .catch(error => {
        dispatch(deleteError(error));
        dispatch(fetchData(plural));
      });
  };
}

/**
 * Clears date in state.
 *
 * @param {string} plural
 * @return {function}
 */
export function clearData(plural) {
  return dispatch => {
    dispatch({type: CLEAR_DATA, data: {plural}});
  };
}
