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
      children: {},
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
      children: {},
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

  it('should handle POLLING_DATA', () => {
    detailReducer(
      {
        isLoading: true,
        children: {},
        polling: false,
        data: [
          {
            data: 'currentData'
          },
          {
            data: 'currentData'
          }
        ]
      }, {
        type: actionTypes.POLLING_DATA,
        data: {
          0: {
            path: 'sample1'
          },
          1: {
            path: 'sample2'
          },
          2: {
            data: 'sampledata'
          }
        }
      }
    ).should.deep.equal({
      isLoading: true,
      children: {},
      polling: true,
      data: {
        0: {
          path: 'sample1'
        },
        1: {
          path: 'sample2'
        },
        2: {
          data: 'sampledata'
        }
      }
    });
  });

  it('should handle CANCEL_POLLING_DATA', () => {
    detailReducer(
      {
        isLoading: true,
        children: {},
        polling: false,
        data: [
          {
            data: 'currentData'
          },
          {
            data: 'currentData'
          }
        ]
      }, {
        type: actionTypes.POLLING_DATA,
        data: {
          0: {
            path: 'newData'
          },
          1: {
            path: 'newData'
          },
          2: {
            data: 'newData'
          }
        }
      }
    ).should.deep.equal({
      isLoading: true,
      children: {},
      polling: true,
      data: {
        0: {
          path: 'newData'
        },
        1: {
          path: 'newData'
        },
        2: {
          data: 'newData'
        }
      }
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
