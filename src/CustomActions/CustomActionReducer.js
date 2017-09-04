import {
  EXECUTE_SUCCESS,
  CLEAR_RESPONSE,
} from './CustomActionsActionTypes';

export const CustomActionReducer = (state = {result: undefined}, action) => {
  const {
    type,
    data
  } = action;

  switch (type) {
    case EXECUTE_SUCCESS:
      return {
        ...state,
        result: data
      };
    case CLEAR_RESPONSE:
      return {
        result: undefined
      };
    default:
      return state;
  }
};

export default CustomActionReducer;
