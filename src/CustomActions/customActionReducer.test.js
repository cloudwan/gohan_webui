/* global it, describe */
import chai from 'chai';
import * as actionTypes from './customActionsActionTypes';
import customActionReducer from './customActionReducer';

chai.should();

describe('customActionReducer ', () => {
  it('should return initial state', () => {
    customActionReducer(undefined, {}).should.deep.equal({result: undefined});
    customActionReducer({result: undefined}, {}).should.deep.equal({result: undefined});
  });

  it(`should handle ${actionTypes.EXECUTE_SUCCESS}`, () => {
    customActionReducer(
      undefined, {
        type: actionTypes.EXECUTE_SUCCESS,
        data: {}
      }
    ).should.deep.equal({
      result: {}
    });
  });

  it(`should handle ${actionTypes.CLEAR_RESPONSE}`, () => {
    customActionReducer({
      result: {}
      }, {
        type: actionTypes.CLEAR_RESPONSE,
      }
    ).should.deep.equal({
      result: undefined
    });
  });
});
