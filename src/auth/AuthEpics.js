import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';

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
  scopedLoginSuccess,
  scopedLoginFailure,
  fetchDomainsSuccess,
  fetchDomainsFailure,
} from './AuthActions';
import {isUserAdmin} from './AuthSelectors';

const computeOffsetForTokenRenewal = date => {
  const earlyWarningTime = 5 * 60 * 1000; // warn/renew 5 minutes earlier
  const now = new Date();
  let offset = new Date(date) - now;

  if (offset > earlyWarningTime) {
    offset -= earlyWarningTime;
  }

  return offset;
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
    .mergeMap(({unscopedToken, tokenId, tenant}) => {
      const state = store.getState();
      const {
        authUrl,
        cloudAdmin,
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

        const actions = [
          checkTokenSuccess(
            item[0].token,
            item[1].token,
            item[1].expires_at,
            selectedTenant,
            item[1].user,
            item[1].roles,
            scope,

          ),
          {
            type: FETCH_TENANTS,
            scope,
          },
        ];

        if (isCloudAdmin(item[1].user, cloudAdmin)) {
          actions.push({type: FETCH_DOMAINS});
        }

        return actions;
      });
    });

export const login = (action$, store, call = (fn, ...args) => fn(...args)) => {
  return action$.ofType(LOGIN)
    .mergeMap(({username, password, domain}) => {
      const state = store.getState();
      const {
        authUrl,
        useKeystoneDomain,
        domainName,
        cloudAdmin,
      } = state.configReducer;
      const headers = {
        'Content-Type': 'application/json'
      };

      if (authUrl) {
        const selectedDomainName = (useKeystoneDomain ? domain : domainName) || 'default';
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

          return Observable.concat(
            Observable.of(loginSuccess(
              response.xhr.getResponseHeader('X-Subject-Token'),
              response.response.token.expires_at,
              response.response.token.user,
            )),
            Observable.of({type: SCOPED_LOGIN, scope})
          );
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
      const {authUrl} = state.configReducer;
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
          return Observable.concat(
            Observable.of(scopedLoginSuccess(
              response.xhr.getResponseHeader('X-Subject-Token'),
              response.response.token.expires_at, // eslint-disable-line camelcase
              response.response.token.roles,
              scope,
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
          if (error.status === 401 && !isUserAdmin(state)) {
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
      } = state.configReducer;
      const {
        tokenId,
        unscopedToken,
        user,
      } = state.authReducer;
      const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': tokenId || unscopedToken,
      };

      if (authUrl) {
        const query = (scope && scope.domain) ? `?domain_id=${scope.domain.id}` : '';
        const url = isUserAdmin(state) ? `${authUrl}/projects${query}` : `${authUrl}/auth/projects`;
        return call(
          get,
          url,
          headers
        )
          .flatMap(response => {
            const actions = [
              Observable.of(fetchTenantSuccess(response.response.projects)),
            ];
            if (isCloudAdmin(user, cloudAdmin)) {
              actions.unshift(Observable.of({type: FETCH_DOMAINS}));
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
