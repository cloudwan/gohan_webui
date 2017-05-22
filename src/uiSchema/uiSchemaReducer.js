import {FETCH_SUCCESS} from './UiSchemaActionTypes';

const uiSchemaReducer = (
  state = {
    isLoading: true,
    data: []
  },
  action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        isLoading: false,
        data: [...action.data]
      };
    default:
      return state;
  }
};

export default uiSchemaReducer;
