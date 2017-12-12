import {
  UPDATE_FULFILLED,
  UPDATE_FAILURE,
  SET_INITIAL_DOC_TITLE
} from './breadcrumbActionTypes';

export const breadcrumbReducer = (state = {data: []}, action) => {
  const {
    type,
    data,
    error,
    initialDocTitle
  } = action;

  switch (type) {
    case UPDATE_FULFILLED:
      return {
        ...state,
        data,
      };
    case UPDATE_FAILURE:
      return {
        ...state,
        error
      };
    case SET_INITIAL_DOC_TITLE:
      return {
        ...state,
        initialDocTitle
      };
    default:
      return state;
  }
};

export default breadcrumbReducer;
