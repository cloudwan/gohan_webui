/* global it, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import {CLOSE, ERROR} from './../Dialog/dialogActionTypes';
import * as actionTypes from './tableActionTypes';
import {
  fetchEpic,
  createEpic,
  updateEpic,
  purgeEpic
} from './tableEpics';


chai.should();

describe('TableEpics', () => {
  const mockStore = configureMockStore();
  const store = mockStore(
    {
      schemaReducer: {
        data: [
          {
            id: 'test',
            parent: '',
            prefix: 'v1.0',
            plural: 'tests'
          }
        ]
      },
      configReducer: {
        polling: false,
        pollingInterval: 5000,
        gohan: {
          url: 'http://gohan.io'
        }
      },
      authReducer: {
        tokenId: 'sampleTokenId'
      }
    }
  );

  describe('fetchEpic()', () => {
    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action`, () => {
      const response = {
        response: {
          test: {
            name: 'foo',
          },
        },
        xhr: {
          getResponseHeader: header => {
            header.should.equal('X-Total-Count');

            return 1;
          }
        }
      };

      expectEpic(fetchEpic, {
        expected: [
          '-a',
          {
            a: {
              type: actionTypes.FETCH_SUCCESS,
              data: {
                schemaId: 'test',
                sortKey: '',
                sortOrder: '',
                limit: 0,
                offset: 0,
                filters: [],
                totalCount: 1,
                payload: {
                  name: 'foo',
                }
              },
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH,
            schemaId: 'test',
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.FETCH_FAILURE} action`, () => {
      const response = {};

      expectEpic(fetchEpic, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.FETCH_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.FETCH,
            schemaId: 'test',
            params: {
              test_id: 'foo' // eslint-disable-line camelcase
            }
          },
        }],
        response: [
          '-#|',
          null,
          {
            xhr: response
          }
        ],
        store
      });
    });
  });

  describe('createEpic()', () => {
    it(`should dispatch ${actionTypes.CREATE_SUCCESS}, ${CLOSE} and ${actionTypes.FETCH} actions`, () => {
      const response = {
        response: {}
      };

      expectEpic(createEpic, {
        expected: [
          '-(abc)',
          {
            a: {
              type: actionTypes.CREATE_SUCCESS,
            },
            b: {
              type: CLOSE,
              name: 'test_create'
            },
            c: {
              type: actionTypes.FETCH,
              params: {},
              schemaId: 'test',
              options: undefined
            }
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.CREATE,
            schemaId: 'test',
            params: {},
            data: {}
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${ERROR} action`, () => {
      const response = {};

      expectEpic(createEpic, {
        expected: [
          '-(a|)',
          {
            a: {
              type: ERROR,
              message: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.CREATE,
            schemaId: 'test',
            data: {}
          },
        }],
        response: [
          '-#|',
          null,
          {
            xhr: response
          }
        ],
        store
      });
    });
  });

  describe('updateEpic()', () => {
    it(`should dispatch ${actionTypes.CREATE_SUCCESS}, ${CLOSE} and ${actionTypes.FETCH} actions`, () => {
      const response = {
        response: {}
      };

      expectEpic(updateEpic, {
        expected: [
          '-(abc)',
          {
            a: {
              type: actionTypes.UPDATE_SUCCESS,
            },
            b: {
              type: CLOSE,
              name: 'test_update'
            },
            c: {
              type: actionTypes.FETCH,
              params: {},
              schemaId: 'test',
              options: undefined
            }
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.UPDATE,
            schemaId: 'test',
            params: {},
            data: {}
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${ERROR} action`, () => {
      const response = {};

      expectEpic(updateEpic, {
        expected: [
          '-(a|)',
          {
            a: {
              type: ERROR,
              message: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.UPDATE,
            schemaId: 'test',
            data: {}
          },
        }],
        response: [
          '-#|',
          null,
          {
            xhr: response
          }
        ],
        store
      });
    });
  });

  describe('purgeEpic()', () => {
    it(`should dispatch ${actionTypes.PURGE_SUCCESS}, ${CLOSE} and ${actionTypes.FETCH} actions`, () => {
      const response = {
        response: {}
      };

      expectEpic(purgeEpic, {
        expected: [
          '-(ab)',
          {
            a: {
              type: actionTypes.PURGE_SUCCESS,
            },
            b: {
              type: actionTypes.FETCH,
              params: {},
              schemaId: 'test',
              options: undefined
            }
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.PURGE,
            schemaId: 'test',
            params: {},
            id: 'bad45'
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.PURGE_SUCCESS}, ${CLOSE} and ${actionTypes.FETCH} actions for ids list`, () => {
      const response = {
        response: {}
      };

      expectEpic(purgeEpic, {
        expected: [
          '--(ab)',
          {
            a: {
              type: actionTypes.PURGE_SUCCESS,
            },
            b: {
              type: actionTypes.FETCH,
              params: {},
              schemaId: 'test',
              options: undefined
            }
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.PURGE,
            schemaId: 'test',
            params: {},
            id: [
              'bad45',
              '5384'
            ]
          }
        }],
        response: ['-a|', {
          a: response
        }],
        store
      });
    });

    it(`should dispatch ${actionTypes.PURGE_FAILURE} action`, () => {
      const response = {};

      expectEpic(purgeEpic, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.PURGE_FAILURE,
              error: 'Unknown error!'
            }
          }
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.PURGE,
            schemaId: 'test',
            id: 'bad45'
          },
        }],
        response: [
          '-#|',
          null,
          {
            xhr: response
          }
        ],
        store
      });
    });
  });
});

