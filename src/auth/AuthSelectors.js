import {createSelector} from 'reselect';
import groupBy from 'lodash/groupBy';

const isLogged = state => state.authReducer.logged;
const tokenId = state => state.authReducer.tokenId;
const unscopedToken = state => state.authReducer.unscopedToken;
const tokenExpires = state => state.authReducer.tokenExpires;
const tenant = state => state.authReducer.tenant;
const tenants = state => state.authReducer.tenants;
const user = state => state.authReducer.user;
const inProgress = state => state.authReducer.inProgress;
const showTokenRenewal = state => state.authReducer.showTokenRenewal;
const storagePrefix = state => state.configReducer.storagePrefix;
const tenantFilterStatus = state => state.authReducer.tenantFilterStatus;
const roles = state => state.authReducer.roles || [];
const domains = state => state.authReducer.domains || [];

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

export const getUnscopedToken = createSelector(
  [unscopedToken],
  unscopedToken => unscopedToken
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
  tenant => (tenant && tenant.name) ? tenant.name : ''
);

export const getTenantId = createSelector(
  [tenant],
  tenant => (tenant && tenant.id) ? tenant.id : ''
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
  user => user ? (user.username || user.name) : ''
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

export const getStoragePrefix = createSelector(
  [storagePrefix],
  storagePrefix => storagePrefix
);

export const isTenantFilterActive = createSelector(
  [tenantFilterStatus],
  tenantFilterStatus => Boolean(tenantFilterStatus)
);

export const isUserAdmin = createSelector(
  [roles],
  roles => roles.some(role => role.name.toLowerCase() === 'admin'),
);

export const getDomains = createSelector(
  [domains],
  domains => domains,
);

export const getTenantsByDomain = createSelector(
  [domains, tenants],
  (domains, tenants) => {
    const tenantsByDomain = groupBy(tenants, 'domain_id');
    if (!tenants || tenants.length === 0) {
      return {};
    }

    if (Object.keys(tenantsByDomain).length === 1) {
      const domainId = Object.keys(tenantsByDomain)[0];

      return {
        [domainId]: {
          tenants: tenantsByDomain[domainId],
        }
      };
    }

    return Object.keys(tenantsByDomain).reduce((result, domainId) => {
      const domainTenants = tenantsByDomain[domainId];
      if (domainTenants && domainTenants.length > 0) {
        const domain = domains.find(domain => domain.id === domainId);
        result[domainId] = {
          name: domain && domain.name ? domain.name : domainId,
          tenants: domainTenants
        };
      }

      return result;
    }, {});
  }
);
