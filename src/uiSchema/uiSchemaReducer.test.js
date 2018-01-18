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

  it(`should handle ${actionTypes.FETCH} action`, () => {
    uiSchemaReducer(
      undefined, {
        type: actionTypes.FETCH,
      }
    ).should.deep.equal({
      isLoading: true,
      data: [],
    });
  });

  it(`should handle ${actionTypes.FETCH_SUCCESS} action`, () => {
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

  it(`should handle ${actionTypes.FETCH_FAILURE} action`, () => {
    uiSchemaReducer(
      undefined, {
        type: actionTypes.FETCH_FAILURE,
        error: 'Unknown error!',
      }
    ).should.deep.equal({
      error: 'Unknown error!',
      data: [],
      isLoading: false,
    });
  });
});
