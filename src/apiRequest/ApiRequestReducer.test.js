/* global it, describe */

import chai from 'chai';
import * as actionTypes from './ApiRequestActionTypes';
import apiRequestReducer from './ApiRequestReducer';

chai.should();

describe('ApiRequestReducer', () => {
  it('should return initial state', () => {
    apiRequestReducer(undefined, {}).should.deep.equal({
      response: undefined,
      error: undefined,
    });

    apiRequestReducer({
      response: {},
      error: undefined,
    }, {}).should.deep.equal({
      response: {},
      error: undefined,
    });
  });

  it(`should handle ${actionTypes.FETCH_SUCCESS} action type`, () => {
    apiRequestReducer(undefined, {
      type: actionTypes.FETCH_SUCCESS,
      data: {
        name: 'test',
        id: 'test123',
      },
    }).should.deep.equal({
      response: {
        name: 'test',
        id: 'test123',
      },
      error: undefined,
    });
  });

  it(`should handle ${actionTypes.FETCH_FAILURE} action type`, () => {
    apiRequestReducer(undefined, {
      type: actionTypes.FETCH_FAILURE,
      error: {
        message: 'test error message',
      },
    }).should.deep.equal({
      response: undefined,
      error: {
        message: 'test error message',
      },
    });
  });

  it(`should handle ${actionTypes.CLEAR_DATA} action type`, () => {
    apiRequestReducer(undefined, {
      type: actionTypes.CLEAR_DATA,
    }).should.deep.equal({
      response: undefined,
      error: undefined,
    });
  });
});
