/* global it, describe */
import chai from 'chai';
import * as actionTypes from './DetailActionTypes';
import detailReducer from './detailReducer';

chai.should();

describe('detailReducer ', () => {

  it('should return initial state', () => {
    detailReducer(undefined, {}).should.deep.equal({
      isLoading: true,
      data: {},
    });

    detailReducer({isLoading: true, data: {}}, {}).should.deep.equal({
      isLoading: true,
      data: {},
    });
  });

  it(`should handle ${actionTypes.FETCH_SUCCESS} action type`, () => {
    detailReducer(
      undefined, {
        type: actionTypes.FETCH_SUCCESS,
        data: {
          name: 'sample1'
        },
      }
    ).should.deep.equal({
      isLoading: false,
      data: {
        name: 'sample1'
      }
    });
  });

  it(`should handle ${actionTypes.CLEAR_DATA} action type`, () => {
    detailReducer(
      undefined, {
        type: actionTypes.CLEAR_DATA
      }
    ).should.deep.equal({
      isLoading: true,
      data: {},
    });
  });
});
