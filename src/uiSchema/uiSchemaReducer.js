import {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
} from './UiSchemaActionTypes';

const uiSchemaReducer = (
  state = {
    isLoading: true,
    data: []
  },
  action) => {
  const {
    type,
    data,
    error,
  } = action;

  switch (type) {
    case FETCH:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: [...data],
      };
    case FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error,
      };
    default:
      return state;
  }
};

export default uiSchemaReducer;
