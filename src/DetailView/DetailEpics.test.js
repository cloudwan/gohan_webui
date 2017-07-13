/* global it, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import * as actionTypes from './DetailActionTypes';
import {
  fetch
} from './DetailEpics';

chai.should();

describe('DetailEpics', () => {
  const mockStore = configureMockStore();
  const store = mockStore(
    {
      configReducer: {
        polling: false,
        gohan: {
          url: 'http://gohan.io'
        }
      },
      authReducer: {
        tokenId: 'sampleTokenId'
      }
    }
  );

  describe('fetch()', () => {
    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action`, () => {
      const response = {
        response: {
          test: {
            name: 'foo',
          },
        },
      };

      expectEpic(fetch, {
        expected: [
          '-a',
          {
            a: {
              type: actionTypes.FETCH_SUCCESS,
              data: {
                name: 'foo',
              },
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH,
            url: '/test/url'
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

      expectEpic(fetch, {
        expected: [
          '-a',
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
            url: 'test/url',
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
