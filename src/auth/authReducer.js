import {LOGIN, LOGIN_SUCCESS, TENANT_FETCH_SUCCESS} from './AuthActionTypes';

export default function authReducer(state = {}, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        ...action.data
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        tokenId: action.data.access.token.id,
        tokenExpires: action.data.access.token.expires,
        tenant: action.data.access.token.tenant
      };
    case TENANT_FETCH_SUCCESS:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}
