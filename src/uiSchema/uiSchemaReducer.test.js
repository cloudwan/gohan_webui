/* global it, describe */
import chai from 'chai';
import * as actionTypes from './UiSchemaActionTypes';
import uiSchemaReducer from './uiSchemaReducer';

chai.should();

describe('uiSchemaReducer ', () => {

  it('should return initial state', () => {
    uiSchemaReducer(undefined, {}).should.deep.equal({
      data: [],
      isLoading: true
    });
  });

  it('should handle FETCH_SUCCESS', () => {
    uiSchemaReducer(
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
