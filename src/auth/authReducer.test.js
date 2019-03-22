/* global it, describe */
import chai from 'chai';
import * as actionTypes from './AuthActionTypes';
import reducer from './authReducer';

chai.should();

describe('authReducer ', () => {

  it('should return initial state', () => {
    reducer(undefined, {}).should.deep.equal(
      {
        inProgress: true,
        logged: false,
        logoutTimeoutId: -1,
        showTokenRenewal: false,
        tenantFilterStatus: false,
        domains: [],
        roles: [],
        scope: {},
      });
    reducer({}, {}).should.deep.equal({});
  });

  it('should handle LOGIN_SUCCESS', () => {
    reducer(undefined, {
      type: actionTypes.LOGIN_SUCCESS,
      data: {
        tokenId: 'testId',
        tokenExpires: 'expires date',
        user: {
          username: 'Admin'
        },
      }
    }).should.deep.equal(
      {
        tenantFilterStatus: false,
        inProgress: false,
        logged: false,
        logoutTimeoutId: -1,
        unscopedToken: 'testId',
        tokenExpires: 'expires date',
        user: {
          username: 'Admin'
        },
        showTokenRenewal: false,
        domains: [],
        roles: [],
        scope: {},
      }
    );
  });

  it('should handle LOGIN_ERROR', () => {
    reducer(undefined, {
      type: actionTypes.LOGIN_ERROR,
    }).should.deep.equal({
      tenantFilterStatus: false,
      inProgress: false,
      logged: false,
      logoutTimeoutId: -1,
      showTokenRenewal: false,
      domains: [],
      roles: [],
      scope: {},
    });
  });

  it('should handle LOGOUT', () => {
    reducer(undefined, {
      type: actionTypes.LOGOUT,
    }).should.deep.equal({
      tenantFilterStatus: false,
      inProgress: false,
      logged: false,
      logoutTimeoutId: -1,
      showTokenRenewal: false
    });
  });

  it('should handle LOGIN_INPROGRESS', () => {
    reducer(undefined, {
      type: actionTypes.LOGIN_INPROGRESS,
    }).should.deep.equal({
      inProgress: true,
      logged: false,
      logoutTimeoutId: -1,
      showTokenRenewal: false,
      tenantFilterStatus: false,
      domains: [],
      roles: [],
      scope: {},
    });
  });

  it('should handle FETCH_TENANTS_SUCCESS', () => {
    reducer(undefined, {
      data: [
        {
          name: 'test tenant'
        }
      ],
      isLogged: true,
      type: actionTypes.FETCH_TENANTS_SUCCESS,
    }).should.deep.equal({
      tenants: [
        {
          name: 'test tenant'
        }
      ],
      inProgress: false,
      logged: true,
      logoutTimeoutId: -1,
      showTokenRenewal: false,
      tenantFilterStatus: false,
      domains: [],
      roles: [],
      scope: {},
    });
  });

  it(`should handle ${actionTypes.SHOW_TOKEN_RENEWAL}`, () => {
    reducer({showTokenRenewal: false}, {
      type: actionTypes.SHOW_TOKEN_RENEWAL,
      status: true
    }).should.deep.equal({
      showTokenRenewal: true,
    });
  });

  it(`should handle ${actionTypes.CLEAR_STORAGE}`, () => {
    reducer(undefined, {
      type: actionTypes.CLEAR_STORAGE,
    }).should.deep.equal({
      inProgress: false,
      logged: false,
      showTokenRenewal: false,
      tenantFilterStatus: false

    });
  });
});
