/* global it, describe */
import chai from 'chai';
import * as actionTypes from './DialogActionTypes';
import dialogReducer from './dialogReducer';

chai.should();

describe('dialogReducer ', () => {

  it('should return initial state', () => {
    dialogReducer(undefined, {}).should.deep.equal({
      isLoading: true,
      schema: undefined
    });
  });

  it('should handle FETCH_SUCCESS', () => {
    dialogReducer(
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
      schema: [
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
    dialogReducer(
      undefined, {
        type: actionTypes.CLEAR_DATA
      }
    ).should.deep.equal({
      isLoading: true,
      schema: undefined
    });
  });
});
