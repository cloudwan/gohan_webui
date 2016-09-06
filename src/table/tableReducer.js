import {FETCH_SUCCESS, CLEAR_DATA, CREATE_SUCCESS} from './TableActionTypes';

export default function tableReducer(state = {isLoading: true, data: []}, action) {
  const {data} = action;

  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data
      };
    case CREATE_SUCCESS:
      return {
        ...state,
        data: [...state.data, data]
      };
    case CLEAR_DATA:
      return {
        isLoading: true,
        data: []
      };
    default:
      return state;
  }
}
