/* global it, describe */
import chai from 'chai';
import * as actionTypes from './AuthActionTypes';
import reducer from './authReducer';

chai.should();

describe('authReducer ', () => {

  it('should return initial state', () => {
    reducer(undefined, {}).should.deep.equal(
      {
        inProgress: false,
        logged: false
      });
    reducer({}, {}).should.deep.equal({});
  });

  it('should handle LOGIN_SUCCESS', () => {
    reducer(undefined, {
      type: actionTypes.LOGIN_SUCCESS,
      data: {
        access: {
          token: {
            id: 'testId',
            expires: 'expires date',
            tenant: {
              id: 'sample Id',
              name: 'demo',
              description: 'Demo tenant',
              enabled: true
            }
          },
          user: {
            username: 'Admin'
          }
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
        }
      }
    );
  });

  it('should handle LOGIN_SUCCESS', () => {
    reducer(undefined, {
      type: actionTypes.LOGOUT,
    }).should.deep.equal({
      inProgress: false,
      logged: false
    });
  });

  it('should handle LOGIN_INPROGRESS', () => {
    reducer(undefined, {
      type: actionTypes.LOGIN_INPROGRESS,
    }).should.deep.equal({
      inProgress: true,
      logged: false
    });
  });

  it('should handle LOGIN_ERROR', () => {
    reducer(undefined, {
      type: actionTypes.LOGIN_ERROR,
    }).should.deep.equal({
      inProgress: false,
      logged: false
    });
  });

  it('should handle LOGIN_ERROR', () => {
    reducer(undefined, {
      data: {
        tenants: [
          {
            name: 'test tenant'
          }
        ]
      },
      type: actionTypes.TENANT_FETCH_SUCCESS,
    }).should.deep.equal({
      tenants: [
        {
          name: 'test tenant'
        }
      ],
      inProgress: false,
      logged: true
    });
  });
});
