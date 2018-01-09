import {
  UPDATE_FULFILLED,
  UPDATE_FAILURE
} from './breadcrumbsActionTypes';

export const breadcrumbReducer = (state = {data: []}, action) => {
  const {
    type,
    data,
    error
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
    default:
      return state;
  }
};

export default breadcrumbReducer;
