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
      polling: false
    });
  });

  it('should handle FETCH_SUCCESS', () => {
    detailReducer(
      undefined, {
        type: actionTypes.FETCH_SUCCESS,
        data: [
          {
            path: 'sample1'
          },
          {
            path: 'sample2'
          }
        ]
      }
    ).should.deep.equal({
      isLoading: false,
      polling: false,
      data: [
        {
          path: 'sample1'
        },
        {
          path: 'sample2'
        }
      ]
    });
  });

  it('should handle CLEAR_DATA', () => {
    detailReducer(
      undefined, {
        type: actionTypes.CLEAR_DATA
      }
    ).should.deep.equal({
      isLoading: true,
      data: {},
      children: {},
      polling: false
    });
  });
});
