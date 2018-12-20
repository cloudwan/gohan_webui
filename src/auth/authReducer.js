import {
  LOGOUT,
  LOGIN_INPROGRESS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SELECT_TENANT,
  FETCH_TENANTS_SUCCESS,
  CLEAR_STORAGE,
  SHOW_TOKEN_RENEWAL,
  CHANGE_TENANT_FILTER_STATUS,
  CHECK_SUCCESS,
  SCOPED_LOGIN_SUCCESS,
  SCOPED_LOGIN_ERROR,
  FETCH_DOMAINS_SUCCESS,
} from './AuthActionTypes';

export default function authReducer(state = {
  inProgress: true,
  tenantFilterStatus: false,
  logged: false,
  showTokenRenewal: false,
  domains: [],
  roles: [],
  scope: {},
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
        tokenExpires: action.data.tokenExpires,
        unscopedToken: action.data.tokenId,
        user: action.data.user,
        inProgress: false,
        showTokenRenewal: false
      };
    case SCOPED_LOGIN_SUCCESS:
      return {
        ...state,
        tokenId: action.data.tokenId,
        tokenExpires: action.data.tokenExpires,
        roles: action.data.roles,
        scope: action.data.scope,
        inProgress: false,
        showTokenRenewal: false,
      };
    case CHECK_SUCCESS:
      return {
        ...state,
        tokenId: action.data.tokenId,
        unscopedToken: action.data.unscopedToken,
        roles: action.data.roles,
        tokenExpires: action.data.tokenExpires,
        tenant: action.data.tenant,
        user: action.data.user,
        scope: action.data.scope,
        inProgress: false,
        showTokenRenewal: false,
        tenantFilterStatus: action.data.tenant !== undefined,
      };
    case SELECT_TENANT:
      return {
        ...state,
        tenant: action.tenant,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        inProgress: false,
        logged: false,
        showTokenRenewal: false
      };
    case SCOPED_LOGIN_ERROR:
      return {
        ...state,
        inProgress: false,
        logged: false,
        showTokenRenewal: false
      };
    case FETCH_DOMAINS_SUCCESS:
      return {
        ...state,
        domains: action.domains,
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
    case CHANGE_TENANT_FILTER_STATUS:
      return {
        ...state,
        tenantFilterStatus: action.status
      };
    default:
      return state;
  }
}
