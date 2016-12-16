import {LOGOUT, LOGIN_SUCCESS, TENANT_FETCH_SUCCESS} from './AuthActionTypes';

export default function authReducer(state = {logged: false}, action) {
  switch (action.type) {
    case LOGOUT:
      return {logged: false};
    case LOGIN_SUCCESS:
      return {
        ...state,
        tokenId: action.data.access.token.id,
        tokenExpires: action.data.access.token.expires,
        tenant: action.data.access.token.tenant,
        user: action.data.access.user
      };
    case TENANT_FETCH_SUCCESS:
      return {
        ...state,
        ...action.data,
        logged: true
      };
    default:
      return state;
  }
}
