/* global it, afterEach, describe, sessionStorage, localStorage */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';

import * as actionTypes from './AuthActionTypes';
import * as actions from './AuthActions';

const should = chai.should();
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('AuthActions ', () => {
  afterEach(() => {
    sessionStorage.clear();
    sessionStorage.itemInsertionCallback = null;
    localStorage.clear();
    localStorage.itemInsertionCallback = null;
  });

  describe('loginSuccess()', () => {
    it(`should set unscoped token in session storage and returns ${actionTypes.LOGIN_SUCCESS} action`, () => {
      actions.loginSuccess(
        'tokenId',
        '1/2/2017',
        {name: 'user'},
        'prefix'
      ).should.deep.equal({
        type: actionTypes.LOGIN_SUCCESS,
        data: {
          tokenId: 'tokenId',
          tokenExpires: '1/2/2017',
          user: {name: 'user'},
        }
      });
      sessionStorage['prefixUnscopedToken'].should.equal('tokenId');
    });
  });

  describe('loginFailure()', () => {
    it(`should returns ${actionTypes.LOGIN_ERROR} action`, () => {
      actions.loginFailure('Error')
        .should.deep.equal({
        type: actionTypes.LOGIN_ERROR,
        error: 'Error'
      });
    });
  });

  describe('login() ', () => {
    it(`should returns ${actionTypes.LOGIN} action`, () => {
      actions.login('userName', 'password')
        .should.deep.equal({
        type: actionTypes.LOGIN,
        username: 'userName',
        password: 'password',
        domain: undefined,
      });
    });
  });

  describe('scopedLoginSuccess', () => {
    it(`should returns ${actionTypes.SCOPED_LOGIN_SUCCESS} action and set scoped token in sessionStorage`, () => {
      actions.scopedLoginSuccess(
        'fooToken',
        '1/1/2018',
        [{name: 'admin'}, {name: 'Member'}],
        {
          project: {
            id: 'tenantId',
          }
        },
        'prefix',
        123,
      ).should.deep.equal({
        type: actionTypes.SCOPED_LOGIN_SUCCESS,
        data: {
          tokenId: 'fooToken',
          tokenExpires: '1/1/2018',
          roles: [
            {name: 'admin'},
            {name: 'Member'},
          ],
          scope: {
            project: {
              id: 'tenantId',
            }
          },
          logoutTimeoutId: 123,
        }
      });

      sessionStorage['prefixScopedToken'].should.equal('fooToken');
    });
  });

  describe('scopedLoginFailure', () => {
    it(`should return ${actionTypes.SCOPED_LOGIN_ERROR} action` , () => {
      actions.scopedLoginFailure('Error')
      .should.deep.equal({
      type: actionTypes.SCOPED_LOGIN_ERROR,
      error: 'Error'
    });
    });
  });


  describe('fetchTenantSuccess()', () => {
    it(`should returns ${actionTypes.FETCH_TENANTS_SUCCESS} action`, () => {
      actions.fetchTenantSuccess(['tenant'], true)
        .should.deep.equal({
        type: actionTypes.FETCH_TENANTS_SUCCESS,
        data: ['tenant'],
        isLogged: true,
      });
    });
  });

  describe('fetchTenantFailure()', () => {
    it(`should returns ${actionTypes.FETCH_TENANTS_FAILURE} action`, () => {
      actions.fetchTenantFailure('Error')
        .should.deep.equal({
        type: actionTypes.FETCH_TENANTS_FAILURE,
        error: 'Error'
      });
    });
  });

  describe('fetchDomainsSuccess', () => {
    it(`should return ${actionTypes.FETCH_DOMAINS_SUCCESS} action`, () => {
      actions.fetchDomainsSuccess([
        {id: 'foo', name: 'Foo'},
        {id: 'bar', name: 'Bar'
      }]).should.deep.equal({
        type: actionTypes.FETCH_DOMAINS_SUCCESS,
        domains: [
          {id: 'foo', name: 'Foo'},
          {id: 'bar', name: 'Bar'},
        ]
      });
    });
  });

  describe('fetchDomainsFailure', () => {
    it(`should return ${actionTypes.FETCH_DOMAINS_FAILURE}`, () => {
      actions.fetchDomainsFailure('Error').should.deep.equal({
        type: actionTypes.FETCH_DOMAINS_FAILURE,
        error: 'Error',
      });
    });
  });

  describe('fetchTokenData() ', () => {
    it(`should returns ${actionTypes.CLEAR_STORAGE} action if session storage is clear`, () => {
      actions.fetchTokenData()
        .should.deep.equal({
        type: actionTypes.CLEAR_STORAGE,
      });
    });

    it(`should returns ${actionTypes.LOGIN} action if session storage contains credentials`, () => {
      sessionStorage.setItem('prefixScopedToken', 'scopedToken');
      sessionStorage.setItem('prefixUnscopedToken', 'unscopedToken');
      sessionStorage.setItem('prefixTenantId', 'tenantId');
      sessionStorage.setItem('prefixTenantName', 'tenantName');
      sessionStorage.setItem('prefixTenantFilterStatus', 'false');

      actions.fetchTokenData('prefix').should.deep.equal({
        type: actionTypes.CHECK_TOKEN,
        tokenId: 'scopedToken',
        unscopedToken: 'unscopedToken',
        tenant: {
          id: 'tenantId',
          name: 'tenantName',
        },
        tenantFilterStatus: false,
      });
    });
  });
  describe('clearStorage() ', () => {
    it(`should returns ${actionTypes.CLEAR_STORAGE} action and clear session storage`, () => {
      sessionStorage.setItem('prefixScopedToken', 'test token');
      sessionStorage.setItem('prefixUnscopedToken', 'test scoped token');

      actions.clearStorage('prefix')
        .should.deep.equal({
        type: actionTypes.CLEAR_STORAGE,
      });

      should.equal(sessionStorage.getItem('prefixScopedToken'), null);
      should.equal(sessionStorage.getItem('prefixUnscopedToken'), null);
    });
  });

  describe('logout() ', () => {
    it(`should dispatch ${actionTypes.CLEAR_STORAGE} action and ${actionTypes.LOGOUT}`, () => {
      const store = mockStore({
        configReducer: {
          storagePrefix: 'prefix'
        }
      });

      store.dispatch(actions.logout());

      store.getActions().should.deep.equal([
        {
          type: actionTypes.CLEAR_STORAGE
        },
        {
          type: actionTypes.LOGOUT,
        }
      ]);
    });
  });

  describe('selectTenant() ', () => {
    it(`should returns ${actionTypes.SELECT_TENANT} action and set items to storage`, () => {
      const store = mockStore({
        authReducer: {
          roles: [{name: 'admin'}],
          logged: false,
        },
        configReducer: {
          useKeystoneDomain: true,
        }
      });

      sessionStorage.setItem('tenantId', 'tenantId');
      sessionStorage.setItem('tenantName', 'tenantName');

      store.dispatch(actions.selectTenant({name: 'tenantName',id: 'tenantId'}));

      should.equal(sessionStorage.getItem('tenantId'), 'tenantId');
      should.equal(sessionStorage.getItem('tenantName'), 'tenantName');

      store.getActions().should.deep.equal([
        {
          type: actionTypes.SELECT_TENANT,
          tenant: {
            name: 'tenantName',
            id: 'tenantId',
          },
          isLogged: true,
        },
      ]);
    });

    it(`should returns ${actionTypes.SELECT_TENANT} and ${actionTypes.SCOPED_LOGIN} actions`, () => {
      const store = mockStore({
        authReducer: {
          roles: [{name: 'Member',}],
          logged: true,
        },
        configReducer: {
          useKeystoneDomain: false,
        },
      });

      store.dispatch(actions.selectTenant({name: 'tenantName',id: 'tenantId'}));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.SCOPED_LOGIN,
          scope: {
            project: {
              id: 'tenantId',
            }
          }
        },
        {
          type: actionTypes.SELECT_TENANT,
          tenant: {
            name: 'tenantName',
            id: 'tenantId',
          },
          isLogged: true,
        },
      ]);
    });

    it('should set tenantId and tenantName in the sessionStorage', () => {
      const store = mockStore({
        authReducer: {
          roles: [{name: 'admin'}]
        },
        configReducer: {
          useKeystoneDomain: false,
        }
      });

      sessionStorage.setItem('tenantId', 'tenantId');
      sessionStorage.setItem('tenantName', 'tenantName');

      store.dispatch(actions.selectTenant({name: 'tenantName',id: 'tenantId'}));

      should.equal(sessionStorage.getItem('tenantId'), 'tenantId');
      should.equal(sessionStorage.getItem('tenantName'), 'tenantName');
    });

    it('should remove tenantId and tenantName in the sessionStorage', () => {
      const store = mockStore({
        authReducer: {
          roles: [{name: 'admin'}]
        },
        configReducer: {
          useKeystoneDomain: false,
        }
      });

      store.dispatch(actions.selectTenant());

      should.equal(sessionStorage.getItem('tenantId'), null);
      should.equal(sessionStorage.getItem('tenantName'), null);
    });
  });

  describe('changeTenantFilter() ', () => {
    it(`should returns ${actionTypes.CHANGE_TENANT_FILTER_STATUS} action`, () => {
      const store = mockStore({
        configReducer: {
          storagePrefix: 'prefix',
        }
      });
      store.dispatch(actions.changeTenantFilter(true));
      store.getActions().should.deep.equal([
        {
          type: actionTypes.CHANGE_TENANT_FILTER_STATUS,
          status: true
        }
      ]);
      sessionStorage.getItem('prefixTenantFilterStatus').should.equal('true');
    });
  });

  describe('renewToken() ', () => {
    it(`should return ${actionTypes.SCOPED_LOGIN} action`, () => {
      const store = mockStore({
        authReducer: {
          scope: {
            project: {
              id: 'projectScopeId',
            }
          },
          user: {
            domain: {
              id: 'domainId',
            }
          }
        }
      });

      store.dispatch(actions.renewToken('testUsername', 'testPassword'));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.SCOPED_LOGIN,
          scope: {
            project: {
              id: 'projectScopeId',
            }
          },
          identity: {
            methods: [
              'password'
            ],
            password: {
              user: {
                domain: {
                  id: 'domainId',
                },
                name: 'testUsername',
                password: 'testPassword',
              }
            }
          }
        }
      ]);
    });
  });

  describe('checkTokenSuccess', () => {
    it(`should dispatch ${actionTypes.CHECK_SUCCESS} action and set data in session storage`, () => {
      const store = mockStore();
      store.dispatch(actions.checkTokenSuccess(
        'unscopedToken',
        'scopedToken',
        '2019-02-27T11:50:58.000000Z',
        {name: 'Foo', id: 'foo'},
        {name: 'Bar'},
        ['Member'],
        {project: {id: 'baz'}},
        false,
        'prefix',
        123,
      ));
      store.getActions().should.deep.equal([
        {
          type: actionTypes.CHECK_SUCCESS,
          data: {
            logoutTimeoutId: 123,
            tokenId: 'scopedToken',
            unscopedToken: 'unscopedToken',
            tokenExpires: '2019-02-27T11:50:58.000000Z',
            tenant: {name: 'Foo', id: 'foo'},
            user: {name: 'Bar'},
            roles: ['Member'],
            scope: {
              project: {
                id: 'baz',
              }
            },
            tenantFilterStatus: false,
          }
        }
      ]);

      should.equal(sessionStorage.getItem('prefixScopedToken'), 'scopedToken');
      should.equal(sessionStorage.getItem('prefixUnscopedToken'), 'unscopedToken');
      should.equal(sessionStorage.getItem('prefixTenantFilterStatus'), 'false');
    });
  });

  describe('sessionStorageTransfer', () => {
    it(`should dispatch ${actionTypes.INIT_SESSION_STORAGE_TRANSFER} action`, () => {
      const store = mockStore({configReducer: {}});
      store.dispatch(actions.sessionStorageTransfer({}));
      store.getActions().should.deep.equal([
        {
          type: actionTypes.INIT_SESSION_STORAGE_TRANSFER,
        }
      ]);
    });

    it(`should dispatch ${actionTypes.INIT_SESSION_STORAGE_TRANSFER} action and set sessionStorage data to localStorage`, () => { // eslint-disable-line
      const store = mockStore({
        configReducer: {
          storagePrefix: 'FOO',
        }
      });

      sessionStorage.setItem('bar', 'faz');

      store.dispatch(actions.sessionStorageTransfer({
        key: 'FOOgetSessionStorage',
        newValue: '{"foo": "bar"}',
      }));
      store.getActions().should.deep.equal([
        {
          type: actionTypes.INIT_SESSION_STORAGE_TRANSFER,
        }
      ]);

      should.equal(localStorage.getItem('FOOsessionStorage'), JSON.stringify({bar: 'faz'}));
      setTimeout(() => {
        should.equal(localStorage.getItem('FOOsessionStorage'), null);
        should.equal(localStorage.getItem('FOOgetSessionStorage'), null);
      }, 0);
    });

    it(`should dispatch ${actionTypes.INIT_SESSION_STORAGE_TRANSFER} action and set new data to sessionStorage`, () => { // eslint-disable-line
      const store = mockStore({
        configReducer: {
          storagePrefix: 'FOO',
        }
      });

      store.dispatch(actions.sessionStorageTransfer({
        key: 'FOOsessionStorage',
        newValue: '{"foo": "bar"}',
      }));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.INIT_SESSION_STORAGE_TRANSFER,
        }
      ]);

      should.equal(sessionStorage.getItem('foo'), 'bar');
    });

    it(`should dispatch ${actionTypes.INIT_SESSION_STORAGE_TRANSFER} and ${actionTypes.LOGOUT} actions`, () => { // eslint-disable-line
      const store = mockStore({
        configReducer: {
          storagePrefix: 'FOO',
        }
      });

      store.dispatch(actions.sessionStorageTransfer({
        key: 'FOOclearSessionStorage',
        newValue: '{"foo": "bar"}',
      }));

      store.getActions().should.deep.equal([
        {
          type: actionTypes.INIT_SESSION_STORAGE_TRANSFER,
        },
        {
          type: actionTypes.CLEAR_STORAGE,
        },
        {
          type: actionTypes.LOGOUT,
        },
      ]);
    });
  });

  describe('transferStorage', () => {
    it(`should dispatch ${actionTypes.TRANSFER_STORAGE} action`, () => {
      const store = mockStore({
        configReducer: {
          storagePrefix: 'FOO',
        }
      });

      store.dispatch(actions.transferStorage());
      store.getActions().should.deep.equal([
        {
          type: actionTypes.TRANSFER_STORAGE
        }
      ]);
    });
  });

  describe('renewTokenInBackground', () => {
    it(`should dispatch ${actionTypes.SCOPED_LOGIN} action`, () => {
      const store = mockStore({
        authReducer: {
          scope: {
            project: {
              id: 'foo',
            }
          },
        }
      });

      store.dispatch(actions.renewTokenInBackground());
      store.getActions().should.deep.equal([
        {
          type: actionTypes.SCOPED_LOGIN,
          scope: {
            project: {
              id: 'foo',
            }
          }
        }
      ]);
    });
  });

  describe('renewTokenFailure', () => {
    const store = mockStore();

    store.dispatch(actions.renewTokenFailure({message: 'foo'}));
    store.getActions().should.deep.equal([
      {
        type: actionTypes.RENEW_TOKEN_FAILURE,
        error: {message: 'foo'}
      }
    ]);
  });
});
