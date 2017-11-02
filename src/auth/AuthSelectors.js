import {createSelector} from 'reselect';

const isLogged = state => state.authReducer.logged;
const tokenId = state => state.authReducer.tokenId;
const tokenExpires = state => state.authReducer.tokenExpires;
const tenant = state => state.authReducer.tenant;
const tenants = state => state.authReducer.tenants;
const user = state => state.authReducer.user;
const inProgress = state => state.authReducer.inProgress;
const showTokenRenewal = state => state.authReducer.showTokenRenewal;

export const getLoggedState = createSelector(
  [isLogged],
  isLogged => {
    return isLogged;
  }
);

export const getTokenId = createSelector(
  [tokenId],
  tokenId => {
    return tokenId;
  }
);

export const getTokenExpires = createSelector(
  [tokenExpires],
  tokenExpires => {
    return tokenExpires;
  }
);

export const getTenant = createSelector(
  [tenant],
  tenant => {
    return tenant;
  }
);

export const getTenantName = createSelector(
  [tenant],
  tenant => tenant.name
);

export const getTenants = createSelector(
  [tenants],
  tenants => {
    return tenants;
  }
);

export const getUser = createSelector(
  [user],
  user => {
    return user;
  }
);

export const getUserName = createSelector(
  [user],
  user => user.username || user.name
);

export const getProgressState = createSelector(
  [inProgress],
  inProgress => {
    return inProgress;
  }
);

export const getShowTokenRenewal = createSelector(
  [showTokenRenewal],
  showTokenRenewal => showTokenRenewal
);
