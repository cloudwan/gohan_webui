/* global it, afterEach, describe, sessionStorage, localStorage */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import chai from 'chai';
import spies from 'chai-spies';

import * as actionTypes from './authActionTypes';
import * as actions from './authActions';

chai.use(spies);
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
    it(`should set token in session storage and returns ${actionTypes.LOGIN_SUCCESS} action`, () => {
      actions.loginSuccess('tokenId', '1/2/2017', {name: 'tenant'}, {name: 'user'})
        .should.deep.equal({
        type: actionTypes.LOGIN_SUCCESS,
        data: {
          tokenId: 'tokenId',
          tokenExpires: '1/2/2017',
          tenant: {name: 'tenant'},
          user: {name: 'user'},
        }
      });
      sessionStorage.token.should.equal('tokenId');
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

  describe('fetchTokenData() ', () => {
    it(`should returns ${actionTypes.CLEAR_STORAGE} action if session storage is clear`, () => {
      actions.fetchTokenData()
        .should.deep.equal({
        type: actionTypes.CLEAR_STORAGE,
      });
    });

    it(`should returns ${actionTypes.LOGIN} action if session storage contains credentials`, () => {
      sessionStorage.setItem('token', 'test token');
      sessionStorage.setItem('tenantName', 'test tenant');
      sessionStorage.setItem('tenantId', 'tenantId');

      actions.fetchTokenData()
        .should.deep.equal({
        type: actionTypes.LOGIN,
        token: 'test token',
        tenant: 'test tenant',
        tenantId: 'tenantId'
      });
    });
  });
  describe('clearStorage() ', () => {
    it(`should returns ${actionTypes.CLEAR_STORAGE} action and clear session storage`, () => {
      sessionStorage.setItem('token', 'test token');
      sessionStorage.setItem('scopedToken', 'test scoped token');
      sessionStorage.setItem('tenantName', 'test tenant');

      actions.clearStorage()
        .should.deep.equal({
        type: actionTypes.CLEAR_STORAGE,
      });

      should.equal(sessionStorage.getItem('token'), null);
      should.equal(sessionStorage.getItem('scopedToken'), null);
      should.equal(sessionStorage.getItem('tenantName'), null);
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

describe('selectTenantSuccess()', () => {
  it(`should set token and tenant in session storage and returns ${actionTypes.LOGIN_SUCCESS} action`, () => {
    actions.selectTenantSuccess('tokenId', '1/2/2017', {name: 'tenant'}, {name: 'user'})
      .should.deep.equal({
      type: actionTypes.LOGIN_SUCCESS,
      data: {
        tokenId: 'tokenId',
        tokenExpires: '1/2/2017',
        tenant: {name: 'tenant'},
        user: {name: 'user'},
      }
    });
    sessionStorage.getItem('scopedToken').should.equal('tokenId');
    sessionStorage.getItem('tenantName').should.equal('tenant');
  });
});

describe('selectTenantFailure()', () => {
  it(`should returns ${actionTypes.SELECT_TENANT_FAILURE} action`, () => {
    actions.selectTenantFailure('Error')
      .should.deep.equal({
      type: actionTypes.SELECT_TENANT_FAILURE,
      error: 'Error'
    });
  });
});

describe('selectTenant() ', () => {
  it(`should returns ${actionTypes.SELECT_TENANT} action`, () => {
    actions.selectTenant('tenantName', 'tenantId')
      .should.deep.equal({
      type: actionTypes.SELECT_TENANT,
      tenantName: 'tenantName',
      tenantId: 'tenantId'
    });
  });
});
