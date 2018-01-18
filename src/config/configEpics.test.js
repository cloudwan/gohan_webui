/* global it, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from './../../test/helpers/expectEpic';

import * as actionTypes from './ConfigActionTypes';
import * as uiSchemaActionTypes from '../uiSchema/UiSchemaActionTypes';
import {fetch} from './configEpics';

chai.should();

describe('configEpics', () => {
  const mockStore = configureMockStore();
  const store = mockStore();

  describe('fetch', () => {
    it(`should dispatch ${actionTypes.FETCH_SUCCESS} and ${uiSchemaActionTypes.FETCH} actions`, () => {
      const response = {
        response: {
          authUrl: 'http://localhost/v2.0',
          gohan: {
            url: 'http://localhost',
          },
          configProp: 'foo',
        },
      };

      expectEpic(fetch, {
        expected: [
          '-(ab)',
          {
            a: {
              type: actionTypes.FETCH_SUCCESS,
              data: {
                authUrl: 'http://localhost/v2.0',
                gohan: {
                  url: 'http://localhost',
                },
                configProp: 'foo',
              },
            },
            b: {
              type: uiSchemaActionTypes.FETCH,
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
