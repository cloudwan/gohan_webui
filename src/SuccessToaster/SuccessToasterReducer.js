import {
  SUCCESS,
  DISMISS,
} from './SuccessToasterActionTypes';

export const SuccessToasterReducer = (state = {}, action) => {
  const {
    type,
    data,
    title,
  } = action;

  switch (type) {
    case SUCCESS:
      return {
        ...state,
        data,
        title,
      };
    case DISMISS:
      return {
        data: undefined,
        title: undefined,
      };
    default:
      return state;
  }
};

export default SuccessToasterReducer;
