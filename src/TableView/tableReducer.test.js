/* global it, describe */
import chai from 'chai';
import * as actionTypes from './TableActionTypes';
import schemaReducer from './tableReducer';

chai.should();

describe('tableReducer ', () => {

  it('should return initial state', () => {
    schemaReducer(undefined, {}).should.deep.equal({});
  });

  it('should handle INIT', () => {
    schemaReducer(
      undefined,
      {
        type: actionTypes.INIT,
        data: {
          plural: 'test1'
        }
      }
    ).should.deep.equal(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      }
    );
  });

  it('should handle FETCH_SUCCESS', () => {
    schemaReducer(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      },
      {
        type: actionTypes.FETCH_SUCCESS,
        data: {
          test1: [
            {
              id: 'sampleId',
              name: 'test123'
            }
          ]


        }
      }
    ).should.deep.equal(
      {
        test1: {
          isLoading: false,
          url: '',
          plural: 'test1',
          data: [
            {
              id: 'sampleId',
              name: 'test123'
            }
          ],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      }
    );
  });

  it('should handle CLEAR_DATA', () => {
    schemaReducer(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      },
      {
        type: actionTypes.CLEAR_DATA,
        data: {
          plural: 'test1'
        }
      }
    ).should.deep.equal(
      {
        test1: undefined
      }
    );
  });

  it('should handle UPDATE_SORT', () => {
    schemaReducer(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      },
      {
        type: actionTypes.UPDATE_SORT,
        data: {
          plural: 'test1',
          sortKey: 'name',
          sortOrder: 'asc'
        }
      }
    ).should.deep.equal(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: 'name',
          sortOrder: 'asc',
          filters: {}
        }
      }
    );
  });

  it('should handle UPDATE_OFFSET', () => {
    schemaReducer(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      },
      {
        type: actionTypes.UPDATE_OFFSET,
        data: {
          plural: 'test1',
          offset: 10,
        }
      }
    ).should.deep.equal(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 10,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      }
    );
  });

  it('should handle UPDATE_FILTERS', () => {
    schemaReducer(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      },
      {
        type: actionTypes.UPDATE_FILTERS,
        data: {
          plural: 'test1',
          filters: {
            key: 'name',
            value: 'test'
          },
        }
      }
    ).should.deep.equal(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {
            key: 'name',
            value: 'test'
          }
        }
      }
    );
  });

  it('should handle DELETE_MULTIPLE_RESOURCES_SUCCESS', () => {
    schemaReducer(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      },
      {
        type: actionTypes.DELETE_MULTIPLE_RESOURCES_SUCCESS,
        data: {
          plural: 'test1',
        }
      }
    ).should.deep.equal(
      {
        test1: {
          isLoading: true,
          url: '',
          plural: 'test1',
          data: [],
          totalCount: 0,
          offset: 0,
          limit: undefined,
          sortKey: undefined,
          sortOrder: undefined,
          filters: {}
        }
      }
    );
  });
});
