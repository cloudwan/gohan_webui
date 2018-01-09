/* global it, describe */

import chai from 'chai';
import * as actionTypes from './apiRequestActionTypes';
import apiRequestReducer from './apiRequestReducer';

chai.should();

describe('ApiRequestReducer', () => {
  it('should return initial state', () => {
    apiRequestReducer(undefined, {}).should.deep.equal({
      response: undefined,
      error: undefined,
      isLoading: false
    });

    apiRequestReducer({
      response: {},
      error: undefined,
      isLoading: false
    }, {}).should.deep.equal({
      response: {},
      error: undefined,
      isLoading: false
    });
  });

  it(`should handle ${actionTypes.FETCH} action type`, () => {
    apiRequestReducer({
      response: {a: 'test'},
      error: undefined,
    }, {
      type: actionTypes.FETCH,
    }).should.deep.equal({
      error: undefined,
      response: undefined,
      isLoading: true
    });
  });

  it(`should handle ${actionTypes.FETCH_SUCCESS} action type`, () => {
    apiRequestReducer(undefined, {
      type: actionTypes.FETCH_SUCCESS,
      data: {
        name: 'test',
        id: 'test123',
      },
      isLoading: true
    }).should.deep.equal({
      response: {
        name: 'test',
        id: 'test123',
      },
      error: undefined,
      isLoading: false
    });
  });

  it(`should handle ${actionTypes.FETCH_FAILURE} action type`, () => {
    apiRequestReducer(undefined, {
      type: actionTypes.FETCH_FAILURE,
      error: {
        message: 'test error message',
      },
      isLoading: true
    }).should.deep.equal({
      response: undefined,
      error: {
        message: 'test error message',
      },
      isLoading: false
    });
  });

  it(`should handle ${actionTypes.CLEAR_DATA} action type`, () => {
    apiRequestReducer(undefined, {
      type: actionTypes.CLEAR_DATA,
    }).should.deep.equal({
      response: undefined,
      error: undefined,
      isLoading: false
    });
  });
});
