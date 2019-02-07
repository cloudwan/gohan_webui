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
    responseFormat,
  } = action;

  switch (type) {
    case SUCCESS:
      return {
        ...state,
        data,
        title,
        url,
        responseFormat,
      };
    case DISMISS:
      return {
        data: undefined,
        title: undefined,
        url: undefined,
        responseFormat: undefined,
      };
    default:
      return state;
  }
};

export default SuccessToasterReducer;
