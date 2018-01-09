/* global document */
import {
  UPDATE,
  UPDATE_FULFILLED,
  UPDATE_FAILURE,
} from './breadcrumbsActionTypes.js';

export const update = data => dispatch => dispatch({
  type: UPDATE,
  data,
});

export const updateFulfilled = (data, initialDocTitle) => {
  if (data && data.length > 0) {
    document.title = `${data[data.length - 1].title} | ${initialDocTitle}`;
  }

  return {
    type: UPDATE_FULFILLED,
    data,
  };
};

export const updateFailure = (error, initialDocTitle) => {
    document.title = initialDocTitle;
    return {
      type: UPDATE_FAILURE,
      error,
    };
};
