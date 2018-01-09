/* global it, describe */
import chai from 'chai';
import * as actionTypes from './errorActionTypes';
import reducer from './errorReducer';

const should = chai.should();

describe('errorReducer ', () => {
  it('should return initial state', () => {
    should.equal(reducer(undefined, {}), null);
  });

  it('should handle RESET_ERROR_MESSAGE', () => {
    should.equal(reducer(undefined, {type: actionTypes.RESET_ERROR_MESSAGE}), null);
    should.equal(reducer('Sample testError', {type: actionTypes.RESET_ERROR_MESSAGE}), null);
  });

  it('should handle all actions with error field', () => {
    reducer(undefined, {error: 'Sample testError'}).should.equal('Sample testError');
  });
});
