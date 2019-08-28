import {
  LOGOUT,
  LOGIN_INPROGRESS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SELECT_TENANT,
  FETCH_TENANTS,
  FETCH_TENANTS_SUCCESS,
  FETCH_TENANTS_FAILURE,
  CLEAR_STORAGE,
  SHOW_TOKEN_RENEWAL,
  RENEW_TOKEN_FAILURE,
  CHANGE_TENANT_FILTER_STATUS,
  CHECK_SUCCESS,
  SCOPED_LOGIN,
  SCOPED_LOGIN_SUCCESS,
  SCOPED_LOGIN_ERROR,
  FETCH_DOMAINS,
  FETCH_DOMAINS_SUCCESS,
  FETCH_DOMAINS_FAILURE,
} from './AuthActionTypes';

export default function authReducer(state = {
  inProgress: true,
  tenantFilterStatus: false,
  logged: false,
  showTokenRenewal: false,
  domains: [],
  roles: [],
  scope: {},
  logoutTimeoutId: -1,
  tenantFilterUseAnyOf: false
}, action) {
  switch (action.type) {
    case CLEAR_STORAGE:
      return {
        inProgress: false,
        logged: false,
        showTokenRenewal: false,
        tenantFilterStatus: false,
        tenantFilterUseAnyOf: false
      };
    case LOGOUT:
      return {
        inProgress: false,
        logged: false,
        showTokenRenewal: false,
        tenantFilterStatus: false,
        logoutTimeoutId: -1,
        tenantFilterUseAnyOf: false
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
        showTokenRenewal: false,
        tenantFilterUseAnyOf: action.data.tenantFilterUseAnyOf,
        isCloudAdmin: action.data.isCloudAdmin,
      };
    case SCOPED_LOGIN:
      return {
        ...state,
        inProgress: true,
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
        logoutTimeoutId: action.data.logoutTimeoutId,
        tenantFilterUseAnyOf: action.data.tenantFilterUseAnyOf
      };
    case SCOPED_LOGIN_ERROR:
      return {
        ...state,
        inProgress: false,
        logged: false,
        showTokenRenewal: false
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
        logoutTimeoutId: action.data.logoutTimeoutId,
        inProgress: false,
        showTokenRenewal: false,
        tenantFilterStatus: action.data.tenantFilterStatus,
        logged: true,
        tenantFilterUseAnyOf: action.data.tenantFilterUseAnyOf
      };
    case SELECT_TENANT:
      return {
        ...state,
        tenant: action.tenant,
        logged: action.isLogged,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        inProgress: false,
        logged: false,
        showTokenRenewal: false
      };
    case FETCH_DOMAINS:
      return {
        ...state,
        inProgress: true,
      };
    case FETCH_DOMAINS_SUCCESS:
      return {
        ...state,
        domains: action.domains,
        inProgress: false,
      };
    case FETCH_DOMAINS_FAILURE:
      return {
        ...state,
        inProgress: false,
      };
    case FETCH_TENANTS:
      return {
        ...state,
        inProgress: true,
      };
    case FETCH_TENANTS_SUCCESS:
      return {
        ...state,
        tenants: [...action.data],
        inProgress: false,
        logged: action.isLogged,
        showTokenRenewal: false
      };
    case FETCH_TENANTS_FAILURE:
      return {
        ...state,
        inProgress: false,
      };
    case SHOW_TOKEN_RENEWAL:
      return {
        ...state,
        showTokenRenewal: true
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
