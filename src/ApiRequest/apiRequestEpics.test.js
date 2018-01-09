/* global it, describe */
import configuraMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import * as actionTypes from './apiRequestActionTypes';
import {fetch} from './apiRequestEpics';

chai.should();

describe('ApiRequestEpics', () => {
  const mockStore = configuraMockStore();
  const store = mockStore({
    authReducer: {
      tokenId: 'sampleTokenId',
    }
  });

  describe('fetch()', () => {
    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action for GET method`, () => {
      const response = {
        response: {
          test: {},
        },
      };

      expectEpic(fetch, {
        expected: [
          '-(a)',
          {
            a: {
              data: {
                test: {},
              },
              type: actionTypes.FETCH_SUCCESS,
            },
          },
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH,
            url: 'test/url',
            method: 'GET',
          },
        }],
        response: ['-a|', {
          a: response,
        }],
        store,
      });
    });

    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action for POST method`, () => {
      const response = {
        response: {
          test: {},
        },
      };

      expectEpic(fetch, {
        expected: [
          '-(a)',
          {
            a: {
              data: {
                test: {},
              },
              type: actionTypes.FETCH_SUCCESS,
            },
          },
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH,
            url: 'test/url',
            method: 'POST',
            body: {
              test: 'test',
            },
          },
        }],
        response: ['-a|', {
          a: response,
        }],
        store,
      });
    });

    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action for PUT method`, () => {
      const response = {
        response: {
          test: {},
        },
      };

      expectEpic(fetch, {
        expected: [
          '-(a)',
          {
            a: {
              data: {
                test: {},
              },
              type: actionTypes.FETCH_SUCCESS,
            },
          },
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH,
            url: 'test/url',
            method: 'PUT',
            body: {
              test: 'test',
            },
          },
        }],
        response: ['-a|', {
          a: response,
        }],
        store,
      });
    });

    it(`should dispatch ${actionTypes.FETCH_FAILURE} action for GET method`, () => {
      const response = {
        response: {},
      };

      expectEpic(fetch, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.FETCH_FAILURE,
              error: 'Unknown error!',
            },
          },
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.FETCH,
            url: 'test/url',
            method: 'GET',
          },
        }],
        response: ['-#|', null, {
          xhr: response,
        }],
        store,
      });
    });

    it(`should dispatch ${actionTypes.FETCH_FAILURE} action for POST method`, () => {
      const response = {
        response: {},
      };

      expectEpic(fetch, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.FETCH_FAILURE,
              error: 'Unknown error!',
            },
          },
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.FETCH,
            url: 'test/url',
            method: 'POST',
            body: {
              test: 'test',
            }
          },
        }],
        response: ['-#|', null, {
          xhr: response,
        }],
        store,
      });
    });

    it(`should dispatch ${actionTypes.FETCH_FAILURE} action for PUT method`, () => {
      const response = {
        response: {},
      };

      expectEpic(fetch, {
        expected: [
          '-(a|)',
          {
            a: {
              type: actionTypes.FETCH_FAILURE,
              error: 'Unknown error!',
            },
          },
        ],
        action: ['(a|)', {
          a: {
            type: actionTypes.FETCH,
            url: 'test/url',
            method: 'PUT',
            body: {
              test: 'test',
            }
          },
        }],
        response: ['-#|', null, {
          xhr: response,
        }],
        store,
      });
    });
  });
});
