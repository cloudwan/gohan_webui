import {
  SUCCESS,
  DISMISS,
} from './SuccessToasterActionTypes';

export const SuccessToasterReducer = (state = {}, action) => {
  const {
    type,
    data,
    title,
    url,
    isDataHtml,
  } = action;

  switch (type) {
    case SUCCESS:
      return {
        ...state,
        data,
        title,
        url,
        isDataHtml,
      };
    case DISMISS:
      return {
        data: undefined,
        title: undefined,
        url: undefined,
        isDataHtml: undefined,
      };
    default:
      return state;
  }
};

export default SuccessToasterReducer;
