import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';
import moment from 'moment';

import {get, post, parseXHRError} from './../api';
import {
  LOGIN,
  CHECK_TOKEN,
  FETCH_TENANTS,
  SCOPED_LOGIN,
  FETCH_DOMAINS,
} from './AuthActionTypes';
import {
  loginSuccess,
  loginFailure,
  checkTokenSuccess,
  fetchTenantSuccess,
  fetchTenantFailure,
  showTokenRenewal,
  renewTokenFailure,
  scopedLoginSuccess,
  scopedLoginFailure,
  fetchDomainsSuccess,
  fetchDomainsFailure,
  selectTenant,
  logout,
} from './AuthActions';
import {isUserAdmin} from './AuthSelectors';

const computeOffsetForTokenRenewal = date => {
  const earlyWarningTime = 5 * 60 * 1000; // warn/renew 5 minutes earlier
  const expiresAt = moment(date);
  const offset = moment.duration(expiresAt.diff(moment()));

  if (offset > earlyWarningTime) {
    return offset - earlyWarningTime;
  }
  return 2000; // Workaround to show token renewal popup
};

const isCloudAdmin = (user, cloudAdmin) => {
  return user && cloudAdmin && user.name === cloudAdmin.username && user.domain.id === cloudAdmin.domainId;
};

export const getTokenInfo = (authUrl, token, call = (fn, ...args) => fn(...args)) =>
  call(
    get,
    `${authUrl}/auth/tokens`,
    {
      'Content-Type': 'application/json',
      'X-Auth-Token': token,
      'X-Subject-Token': token,
    }
  )
    .map(response => ({
      token: response.xhr.getResponseHeader('X-Subject-Token'),
      ...response.response.token,
    }))
    .catch(error => {
      console.error(error);
      return Observable.of(parseXHRError(error));
    });


export const checkToken = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(CHECK_TOKEN)
    .mergeMap(({unscopedToken, tokenId, tenant, tenantFilterStatus}) => {
      const state = store.getState();
      const {
        authUrl,
        storagePrefix,
      } = state.configReducer;

      return Observable.zip(
        call(getTokenInfo, authUrl, unscopedToken),
        call(getTokenInfo, authUrl, tokenId)
      ).flatMap(item => {
        const selectedTenant = item[1].roles && !item[1].roles.some(role => role.name.toLowerCase() === 'admin') ?
          item[1].project :
          tenant;
        const scope = {};

        if (item[1].domain && item[1].domain.id) {
          scope.domain = {
            id: item[1].domain.id,
          };
        } else if (item[1].project && item[1].project.id) {
          scope.project = {
            id: item[1].project.id,
          };
        }

        clearTimeout(state.authReducer.logoutTimeoutId);

        const expiresAt = moment(item[1].expires_at);
        const timeout = moment.duration(expiresAt.diff(moment()));
        const logoutTimeoutId = setTimeout(() => store.dispatch(logout()), timeout);
        const warningOffset = computeOffsetForTokenRenewal(item[1].expires_at);

        return Observable.concat(
          Observable.of(checkTokenSuccess(
            item[0].token,
            item[1].token,
            item[1].expires_at,
            selectedTenant,
            item[1].user,
            item[1].roles,
            scope,
            tenantFilterStatus,
            storagePrefix,
            logoutTimeoutId,
          )),
          Observable.of(
          {
            type: FETCH_TENANTS,
            scope,
          }),
          Observable.of(showTokenRenewal()).delay(warningOffset)
        );
      });
    });

export const login = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(LOGIN)
    .mergeMap(({username, password, domain, unscopedToken}) => {
      const state = store.getState();
      const {
        authUrl,
        useKeystoneDomain,
        domainName,
        cloudAdmin,
        storagePrefix,
      } = state.configReducer;
      const headers = {
        'Content-Type': 'application/json'
      };

      if (authUrl) {
        const selectedDomainName = (useKeystoneDomain && (domainName || domain)) ?
          domainName || domain :
          'default';
        const data = {
          auth: {
            scope: 'unscoped'
          },
        };

        if (username !== undefined && password !== undefined) {
          data.auth.identity = {
            methods: [
              'password'
            ],
            password: {
              user: {
                domain: {
                  name: selectedDomainName,
                },
                name: username,
                password
              }
            }
          };
        } else if (unscopedToken !== undefined) {
          data.auth.identity = {
            methods: [
              'token'
            ],
            token: {
              id: unscopedToken
            }
          };
        }

        return call(
          post,
          `${authUrl}/auth/tokens`,
          headers,
          data
        )
        .flatMap(response => {
          const {user} = response.response.token;
          let scope = {};

          if (useKeystoneDomain) {
            if (isCloudAdmin(user, cloudAdmin)) {
              scope = {
                project: {
                  name: cloudAdmin.projectName,
                  domain: {
                    id: cloudAdmin.domainId,
                  }
                }
              };
            } else {
              scope = {
                domain: {
                  id: user.domain.id,
                }
              };
            }
          }

          const actions = [
            Observable.of(loginSuccess(
              response.xhr.getResponseHeader('X-Subject-Token'),
              response.response.token.expires_at,
              response.response.token.user,
              storagePrefix,
            )),
          ];

          if (useKeystoneDomain) {
            actions.push(Observable.of({type: SCOPED_LOGIN, scope}));
          } else {
            actions.push(Observable.of({type: FETCH_TENANTS}));
          }
          return Observable.concat(...actions);
        })
        .catch(error => {
          console.error(error);
          return Observable.of(loginFailure(parseXHRError(error)));
        });
      }

      console.log('Wrong auth url! Please check config.json.');
      return Observable.of(fetchTenantFailure('Wrong auth url! Please check config.json.'));
    });
};

export const scopedLogin = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(SCOPED_LOGIN)
    .mergeMap(({
      scope,
      identity = {
        methods: ['token'],
        token: {
          id: store.getState().authReducer.unscopedToken,
        }
      }
    }) => {
      const state = store.getState();
      const {authUrl, useKeystoneDomain, storagePrefix} = state.configReducer;
      const {showTokenRenewal: showTokenRenewalState} = state.authReducer;
      const headers = {
        'Content-Type': 'application/json'
      };

      if (authUrl) {
        const data = {
          auth: {
            identity,
            scope,
          },
        };

        return call(
          post,
          `${authUrl}/auth/tokens`,
          headers,
          data
        )
        .flatMap(response => {
          const warningOffset = computeOffsetForTokenRenewal(response.response.token.expires_at);

          clearTimeout(state.authReducer.logoutTimeoutId);

          const expiresAt = moment(response.response.token.expires_at);
          const timeout = moment.duration(expiresAt.diff(moment()));
          const logoutTimeoutId = setTimeout(() => store.dispatch(logout()), timeout);

          return Observable.concat(
            Observable.of(scopedLoginSuccess(
              response.xhr.getResponseHeader('X-Subject-Token'),
              response.response.token.expires_at, // eslint-disable-line camelcase
              response.response.token.roles,
              scope,
              storagePrefix,
              logoutTimeoutId,
            )),
            Observable.of({
              type: FETCH_TENANTS,
              scope: {
                project: response.response.token.project,
                domain: response.response.token.domain
              },
            }),
            Observable.of(showTokenRenewal()).delay(warningOffset),
          );
        })
        .catch(error => {
          console.error(error);
           if (showTokenRenewalState) {
            return Observable.of(renewTokenFailure(parseXHRError(error)));
          } else if (error.status === 401 && !isUserAdmin(state) && useKeystoneDomain) {
            return Observable.of({type: FETCH_TENANTS, scope});
          }

          return Observable.of(scopedLoginFailure(parseXHRError(error)));
        });
      }
    });
};

export const fetchTenants = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(FETCH_TENANTS)
    .mergeMap(({scope}) => {
      const state = store.getState();
      const {
        authUrl,
        cloudAdmin,
        useKeystoneDomain,
      } = state.configReducer;
      const {
        tokenId,
        unscopedToken,
        user,
        logged,
        tenant,
      } = state.authReducer;
      const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': tokenId || unscopedToken,
      };

      if (authUrl) {
        const query = (scope && scope.domain) ? `?domain_id=${scope.domain.id}` : '';
        const isProjectAdmin = isUserAdmin(state) && !scope.domain && !isCloudAdmin(user, cloudAdmin);
        const url = useKeystoneDomain && isUserAdmin(state) && !isProjectAdmin ?
          `${authUrl}/projects${query}` :
          `${authUrl}/auth/projects`;
        return call(
          get,
          url,
          headers
        )
          .flatMap(response => {
            const isLogged = logged || (tokenId && (!useKeystoneDomain || !isUserAdmin(state) || isProjectAdmin));
            const {projects = []} = response.response;
            const actions = [
              Observable.of(fetchTenantSuccess(
                projects,
                isLogged,
              )),
            ];

            if (useKeystoneDomain && isCloudAdmin(user, cloudAdmin)) {
              actions.unshift(Observable.of({type: FETCH_DOMAINS}));
            }

            if (!logged && !tenant && projects && projects.length === 1) {
              actions.push(Observable.of(selectTenant({
                id: projects[0].id,
                name: projects[0].name,
              })));
            }

            return Observable.concat(...actions);
          })
          .catch(error => Observable.of(fetchTenantFailure(parseXHRError(error))));
      }

      console.log('Wrong auth url! Please check config.json.');
      return Observable.of(fetchTenantFailure('Wrong auth url! Please check config.json.'));
    });
};

export const fetchDomains = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(FETCH_DOMAINS)
    .mergeMap(() => {
      const state = store.getState();
      const {authUrl} = state.configReducer;
      const {
        tokenId,
      } = state.authReducer;
      const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': tokenId
      };

      if (authUrl) {
        return call(
          get,
          `${authUrl}/domains`,
          headers
        )
        .flatMap(response => Observable.of(fetchDomainsSuccess(response.response.domains)))
        .catch(error => Observable.of(fetchDomainsFailure(parseXHRError(error))));
      }

      console.log('Wrong auth url! Please check config.json.');
      return Observable.of(fetchDomainsFailure('Wrong auth url! Please check config.json.'));
    });
};

export default combineEpics(
  login,
  scopedLogin,
  fetchTenants,
  fetchDomains,
  checkToken
);
