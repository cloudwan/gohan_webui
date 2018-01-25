/* global it, describe, beforeEach ,afterEach */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';
import sinon from 'sinon';
import {Observable} from 'rxjs/Rx';

import expectEpic from './../../test/helpers/expectEpic';
import * as api from '../api';

import {CLOSE, ERROR} from './../Dialog/DialogActionTypes';
import * as actionTypes from './TableActionTypes';
import {
  fetchEpic,
  createEpic,
  updateEpic,
  removeEpic
} from './TableEpics';

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
    beforeEach(() => {
      sinon.stub(api, 'getPollingTimer').callsFake(() => Observable.of(0));
    });

    afterEach(() => {
      api.getPollingTimer.restore();
    });

    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action`, () => {
      const response = {
        payload: {
          name: 'foo',
        },
        totalCount: 1
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
          'Unknown error!'
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
         'Unknown error!'
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
          'Unknown error!'
        ],
        store
      });
    });
  });

  describe('removeEpic()', () => {
    it(`should dispatch ${actionTypes.PURGE_SUCCESS} and ${actionTypes.FETCH} actions`, () => {
      const response = {
        response: {}
      };

      expectEpic(removeEpic, {
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

    it(`should dispatch ${actionTypes.PURGE_SUCCESS} and ${actionTypes.FETCH} actions for ids list`, () => {
      const response = {
        response: {}
      };

      expectEpic(removeEpic, {
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
      expectEpic(removeEpic, {
        expected: [
          '-(ab|)',
          {
            a: {
              type: actionTypes.PURGE_FAILURE,
              error: 'Unknown error!'
            },
            b: {
              type: actionTypes.FETCH,
              options: undefined,
              params: undefined,
              schemaId: 'test'
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
          'Unknown error!'
        ],
        store
      });
    });
  });
});

