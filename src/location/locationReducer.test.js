/* global it, describe */
import chai from 'chai';
import * as actionTypes from './LocationActionsTypes';
import reducer from './locationReducer';

chai.should();

describe('locationReducer ', () => {

  it('should return initial state', () => {
    reducer(undefined, {}).should.deep.equal({});
  });

  it('should handle LOCATION_CHANGE', () => {
    reducer(undefined, {
      type: actionTypes.LOCATION_CHANGE,
      payload: {
        pathname: 'test'
      }
    }).should.deep.equal(
      {
        pathname: 'test'
      }
    );
  });
});
