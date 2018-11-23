import {
  SUCCESS,
  DISMISS,
} from './SuccessToasterActionTypes';

export const SuccessToasterReducer = (state = {}, action) => {
  const {
    type,
    data,
    title,
    format,
  } = action;

  switch (type) {
    case SUCCESS:
      return {
        ...state,
        data,
        title,
        format,
      };
    case DISMISS:
      return {
        data: undefined,
        title: undefined,
        format: undefined,
      };
    default:
      return state;
  }
};

export default SuccessToasterReducer;
