/* global it, describe */
import chai from 'chai';
import * as actionTypes from './tableActionTypes';
import schemaReducer from './tableReducer';

chai.should();

describe('tableReducer ', () => {

  it('should return initial state', () => {
    schemaReducer(undefined, {}).should.deep.equal({});
  });

  it(`should handle ${actionTypes.FETCH_SUCCESS}`, () => {
    schemaReducer(
      {
        test1: {
          isLoading: true,
          data: [],
          totalCount: 1,
          offset: 0,
          limit: 10,
          sortKey: '',
          sortOrder: '',
          filters: []
        }
      },
      {
        type: actionTypes.FETCH_SUCCESS,
        data: {
          schemaId: 'test1',
          payload: [{
            id: 'sampleId',
            name: 'test123'
          }],
          totalCount: 1,
          limit: 10,
          offset: 0,
          sortKey: '',
          sortOrder: '',
          filters: []
        }
      }
    ).should.deep.equal(
      {
        test1: {
          isLoading: false,
          data: [
            {
              id: 'sampleId',
              name: 'test123'
            }
          ],
          totalCount: 1,
          offset: 0,
          limit: 10,
          sortKey: '',
          sortOrder: '',
          filters: []
        }
      }
    );
  });

  it(`should handle ${actionTypes.CLEAR_DATA}`, () => {
    schemaReducer(
      {
        test1: {
          isLoading: false,
          data: [
            {
              id: 'sampleId',
              name: 'test123'
            }
          ],
          totalCount: 1,
          offset: 0,
          limit: 10,
          sortKey: '',
          sortOrder: '',
          filters: []
        }
      },
      {
        type: actionTypes.CLEAR_DATA,
        data: 'test1'
      }
    ).should.deep.equal(
      {
        test1: undefined
      }
    );
  });
});
