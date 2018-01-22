/* global it, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import * as actionTypes from './UiSchemaActionTypes';
import {fetch} from './uiSchemaEpics';

chai.should();

describe('uiSchemaEpics', () => {
  const mockStore = configureMockStore();
  const store = mockStore();

  describe('fetch', () => {
    it(`should dispatch ${actionTypes.FETCH_SUCCESS} action`, () => {
      const response = {
        response: [
          {path: 'sample1'},
          {path: 'sample2'},
        ],
      };

      expectEpic(fetch, {
        expected: [
          '-a',
          {
            a: {
              type: actionTypes.FETCH_SUCCESS,
              data: [
                {path: 'sample1'},
                {path: 'sample2'},
              ],
            },
          }
        ],
        action: ['(a)', {
          a: {
            type: actionTypes.FETCH,
          }
        }],
        response: ['-a|', {
          a: response,
        }],
        store,
      });
    });

    it(`should dispatch ${actionTypes.FETCH_FAILURE} action`, () => {
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
          }
        }],
        response: [
          '-#|',
          null,
          {
            xhr: response,
          }
        ],
        store
      });
    });
  });
});
