/* global it, describe */
import chai from 'chai';
import * as actionTypes from './authActionTypes';
import reducer from './authReducer';

chai.should();

describe('authReducer ', () => {

  it('should return initial state', () => {
    reducer(undefined, {}).should.deep.equal(
      {
        inProgress: true,
        logged: false,
        showTokenRenewal: false
      });
    reducer({}, {}).should.deep.equal({});
  });

  it('should handle LOGIN_SUCCESS', () => {
    reducer(undefined, {
      type: actionTypes.LOGIN_SUCCESS,
      data: {
        tokenId: 'testId',
        tokenExpires: 'expires date',
        tenant: {
          id: 'sample Id',
          name: 'demo',
          description: 'Demo tenant',
          enabled: true
        },
        user: {
          username: 'Admin'
        }
      }
    }).should.deep.equal(
      {
        inProgress: false,
        logged: false,
        tokenId: 'testId',
        tokenExpires: 'expires date',
        tenant: {
          id: 'sample Id',
          name: 'demo',
          description: 'Demo tenant',
          enabled: true
        },
        user: {
          username: 'Admin'
        },
        showTokenRenewal: false
      }
    );
  });

  it('should handle LOGIN_ERROR', () => {
    reducer(undefined, {
      type: actionTypes.LOGIN_ERROR,
    }).should.deep.equal({
      inProgress: false,
      logged: false,
      showTokenRenewal: false
    });
  });

  it('should handle LOGOUT', () => {
    reducer(undefined, {
      type: actionTypes.LOGOUT,
    }).should.deep.equal({
      inProgress: false,
      logged: false,
      showTokenRenewal: false
    });
  });

  it('should handle LOGIN_INPROGRESS', () => {
    reducer(undefined, {
      type: actionTypes.LOGIN_INPROGRESS,
    }).should.deep.equal({
      inProgress: true,
      logged: false,
      showTokenRenewal: false
    });
  });

  it('should handle FETCH_TENANTS_SUCCESS', () => {
    reducer(undefined, {
      data: [
        {
          name: 'test tenant'
        }
      ],
      type: actionTypes.FETCH_TENANTS_SUCCESS,
    }).should.deep.equal({
      tenants: [
        {
          name: 'test tenant'
        }
      ],
      inProgress: false,
      logged: true,
      showTokenRenewal: false
    });
  });

  it(`should handle ${actionTypes.CLEAR_STORAGE}`, () => {
    reducer(undefined, {
      type: actionTypes.CLEAR_STORAGE,
    }).should.deep.equal({
      inProgress: false,
      logged: false,
      showTokenRenewal: false
    });
  });
});
