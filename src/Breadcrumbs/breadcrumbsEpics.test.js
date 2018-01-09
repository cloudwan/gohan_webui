/* global it, describe */
import configureMockStore from 'redux-mock-store';
import chai from 'chai';

import expectEpic from '../../test/helpers/expectEpic';

import * as actionTypes from './breadcrumbsActionTypes';
import {updateBreadcrumb} from './breadcrumbsEpics';

chai.should();

describe('BreadcrumbEpic', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    configReducer: {
      gohan: {
        url: 'http://gohan.io',
      },
    },
    authReducer: {
      tokenId: 'sampleTokenId',
    },
    breadcrumbReducer: {
      data: [
        {
          title: 'Home',
          url: '/#'
        }
      ],
    },
  });

  describe('updateBreadcrumb', () => {
    it(`should dispatch ${actionTypes.UPDATE_FULFILLED} action empty array as data no elements`, () => {
      const response = [];

      expectEpic(updateBreadcrumb, {
        expected: [
          '-a|',
          {
            a: {
              type: actionTypes.UPDATE_FULFILLED,
              data: [],
            },
          },
        ],
        action: [
          '-a|',
          {
            a: {
              type: actionTypes.UPDATE,
              data: [],
            },
          },
        ],
        response: [
          '-a|',
          {
            a: response,
          }
        ],
        store,
      });
    });

    it(`should dispatch ${actionTypes.UPDATE_FULFILLED} action with the same data as passed elements`, () => {
      const response = [];
      const elements = [
        {
          title: 'testTitle1',
          url: '/#/test_url1',
        },
      ];
      const result = elements;

      expectEpic(updateBreadcrumb, {
        expected: [
          '-a|',
          {
            a: {
              type: actionTypes.UPDATE_FULFILLED,
              data: result,
            },
          },
        ],
        action: [
          '-a|',
          {
            a: {
              type: actionTypes.UPDATE,
              data: elements,
            },
          },
        ],
        response: [
          '-a|',
          {
            a: response,
          }
        ],
        store,
      });
    });

    it(`should dispatch ${actionTypes.UPDATE_FULFILLED} action with updated data`, () => {
      const response = {
          response: {
            grandparentChild: {
              name: 'Parent',
              id: '123',
            },
            parentChild: {
              name: 'Child',
              id: '321',
            }
          }
        };

      const elements = [
        {
          title: 'Grandparent',
          url: '/#/grandparentChildren',
        },
        {
          singular: 'grandparentChild',
          url: '/#/grandparentChildren/123',
        },
        {
          singular: 'parentChild',
          url: '/#/grandparentChildren/123/parentChildren/321',
        },
      ];

      const result = [
        {
          title: 'Grandparent',
          url: '/#/grandparentChildren',
        },
        {
          title: 'Parent',
          url: '/#/grandparentChildren/123',
        },
        {
          title: 'Child',
          url: '/#/grandparentChildren/123/parentChildren/321',
        },
      ];

      expectEpic(updateBreadcrumb, {
        expected: [
          '--a|',
          {
            a: {
              type: actionTypes.UPDATE_FULFILLED,
              data: result,
            },
          },
        ],
        action: [
          '-a|',
          {
            a: {
              type: actionTypes.UPDATE,
              data: elements,
            },
          },
        ],
        response: [
          '-a|',
          {
            a: response,
          },
        ],
        store,
      });
    });
  });
});
