/* global it, describe */
import chai from 'chai';
import * as actionTypes from './schemaActionTypes';
import schemaReducer from './schemaReducer';

chai.should();

describe('schemaReducer ', () => {

  it('should return initial state', () => {
    schemaReducer(undefined, {}).should.deep.equal({
      data: [],
      isLoading: true
    });
  });

  it('should handle FETCH_SUCCESS', () => {
    schemaReducer(
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
      data: [
        {
          path: 'sample1'
        },
        {
          path: 'sample2'
        }
      ],
      isLoading: false
    });
  });
});
