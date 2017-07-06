import {
  LOGOUT,
  LOGIN_INPROGRESS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  FETCH_TENANTS_SUCCESS,
  CLEAR_STORAGE
} from './AuthActionTypes';

export default function authReducer(state = {
  inProgress: true,
  logged: false
}, action) {
  switch (action.type) {
    case CLEAR_STORAGE:
      return {
        inProgress: false,
        logged: false
      };
    case LOGOUT:
      return {
        inProgress: false,
        logged: false
      };
    case LOGIN_INPROGRESS:
      return {
        ...state,
        inProgress: true,
        logged: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        tokenId: action.data.tokenId,
        tokenExpires: action.data.tokenExpires,
        tenant: action.data.tenant,
        user: action.data.user,
        inProgress: false
      };
    case LOGIN_ERROR:
      return {
        ...state,
        inProgress: false,
        logged: false
      };
    case FETCH_TENANTS_SUCCESS:
      return {
        ...state,
        tenants: [...action.data],
        inProgress: false,
        logged: true

      };
    default:
      return state;
  }
}
