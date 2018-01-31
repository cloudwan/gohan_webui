import {
  LOGOUT,
  LOGIN_INPROGRESS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  FETCH_TENANTS_SUCCESS,
  CLEAR_STORAGE,
  SHOW_TOKEN_RENEWAL,
  RENEW_TOKEN_SUCCESS,
  RENEW_TOKEN_FAILURE,
  CHANGE_TENANT_FILTER_STATUS
} from './AuthActionTypes';

export default function authReducer(state = {
  inProgress: true,
  tenantFilterStatus: false,
  logged: false,
  showTokenRenewal: false
}, action) {
  switch (action.type) {
    case CLEAR_STORAGE:
      return {
        inProgress: false,
        logged: false,
        showTokenRenewal: false,
        tenantFilterStatus: false
      };
    case LOGOUT:
      return {
        inProgress: false,
        logged: false,
        showTokenRenewal: false,
        tenantFilterStatus: false
      };
    case LOGIN_INPROGRESS:
      return {
        ...state,
        inProgress: true,
        logged: false,
        showTokenRenewal: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        tokenId: action.data.tokenId,
        tokenExpires: action.data.tokenExpires,
        tenant: action.data.tenant,
        user: action.data.user,
        inProgress: false,
        showTokenRenewal: false
      };
    case LOGIN_ERROR:
      return {
        ...state,
        inProgress: false,
        logged: false,
        showTokenRenewal: false
      };
    case FETCH_TENANTS_SUCCESS:
      return {
        ...state,
        tenants: [...action.data],
        inProgress: false,
        logged: true,
        showTokenRenewal: false
      };
    case SHOW_TOKEN_RENEWAL:
      return {
        ...state,
        showTokenRenewal: true
      };
    case RENEW_TOKEN_SUCCESS:
      return {
        ...state,
        showTokenRenewal: false,
        tokenId: action.data.tokenId,
        tokenExpires: action.data.tokenExpires,
        tenant: action.data.tenant,
        user: action.data.user
      };
    case RENEW_TOKEN_FAILURE:
      return {
        ...state
      };
    case CHANGE_TENANT_FILTER_STATUS:
      return {
        ...state,
        tenantFilterStatus: action.status
      };
    default:
      return state;
  }
}
