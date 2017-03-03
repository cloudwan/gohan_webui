import {
  LOGOUT,
  LOGIN_INPROGRESS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  TENANT_FETCH_SUCCESS
} from './AuthActionTypes';

export default function authReducer(state = {
  inProgress: true,
  logged: false
}, action) {
  switch (action.type) {
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
        tokenId: action.data.access.token.id,
        tokenExpires: action.data.access.token.expires,
        tenant: action.data.access.token.tenant,
        user: action.data.access.user,
        inProgress: false
      };
    case LOGIN_ERROR:
      return {
        ...state,
        inProgress: false,
        logged: false
      };
    case TENANT_FETCH_SUCCESS:
      return {
        ...state,
        ...action.data,
        inProgress: false,
        logged: true

      };
    default:
      return state;
  }
}
