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
      actions.loginSuccess('tokenId', '1/2/2017', {name: 'user'})
        .should.deep.equal({
        type: actionTypes.LOGIN_SUCCESS,
        data: {
          tokenId: 'tokenId',
          tokenExpires: '1/2/2017',
          user: {name: 'user'},
        }
      });
      sessionStorage.unscopedToken.should.equal('tokenId');
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
        }
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
          }
        }
      });

      sessionStorage.scopedToken.should.equal('fooToken');
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
      actions.fetchTenantSuccess(['tenant'])
        .should.deep.equal({
        type: actionTypes.FETCH_TENANTS_SUCCESS,
        data: ['tenant'],
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
      sessionStorage.setItem('scopedToken', 'scopedToken');
      sessionStorage.setItem('unscopedToken', 'unscopedToken');
      sessionStorage.setItem('tenantId', 'tenantId');
      sessionStorage.setItem('tenantName', 'tenantName');

      actions.fetchTokenData()
        .should.deep.equal({
        type: actionTypes.CHECK_TOKEN,
        tokenId: 'scopedToken',
        unscopedToken: 'unscopedToken',
        tenant: {
          id: 'tenantId',
          name: 'tenantName',
        }
      });
    });
  });
  describe('clearStorage() ', () => {
    it(`should returns ${actionTypes.CLEAR_STORAGE} action and clear session storage`, () => {
      sessionStorage.setItem('scopedToken', 'test token');
      sessionStorage.setItem('unscopedToken', 'test scoped token');

      actions.clearStorage()
        .should.deep.equal({
        type: actionTypes.CLEAR_STORAGE,
      });

      should.equal(sessionStorage.getItem('scopedToken'), null);
      should.equal(sessionStorage.getItem('unscopedToken'), null);
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
});

describe('selectTenant() ', () => {
  it(`should returns ${actionTypes.SELECT_TENANT} action and set items to storage`, () => {
    const store = mockStore({
      authReducer: {
        roles: [{name: 'admin'}]
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
      },
    ]);
  });

  it(`should returns ${actionTypes.SELECT_TENANT} and ${actionTypes.SCOPED_LOGIN} actions`, () => {
    const store = mockStore({
      authReducer: {
        roles: [{name: 'Member'}],
      }
    });

    store.dispatch(actions.selectTenant({name: 'tenantName',id: 'tenantId'}));

    store.getActions().should.deep.equal([
      {
        type: actionTypes.SELECT_TENANT,
        tenant: {
          name: 'tenantName',
          id: 'tenantId',
        },
      },
      {
        type: actionTypes.SCOPED_LOGIN,
        scope: {
          project: {
            id: 'tenantId',
          }
        }
      }
    ]);
  });

  it('should set tenantId and tenantName in the sessionStorage', () => {
    const store = mockStore({
      authReducer: {
        roles: [{name: 'admin'}]
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
      }
    });

    store.dispatch(actions.selectTenant());

    should.equal(sessionStorage.getItem('tenantId'), null);
    should.equal(sessionStorage.getItem('tenantName'), null);
  });
});

describe('changeTenantFilter() ', () => {
  it(`should returns ${actionTypes.CHANGE_TENANT_FILTER_STATUS} action`, () => {
    actions.changeTenantFilter(true)
      .should.deep.equal({
        type: actionTypes.CHANGE_TENANT_FILTER_STATUS,
        status: true
      });
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
