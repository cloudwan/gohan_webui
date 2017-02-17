/* global it, describe */
import chai from 'chai';

import * as selectors from './SidebarSelectors';

chai.should();

describe('SidebarSelectors', () => {
  describe('getSidebarMenuItems', () => {
    it('should return appropriate menu items', () => {
      selectors.getSidebarMenuItems(
        {
          configReducer: {
            sidebar: [
              {
                title: 'sampleTest',
                path: 'foo/bar/baz'
              }
            ]
          },
          schemaReducer: {
            data: [
              {
                title: 'test1 title',
                url: '/test1_url',
                metadata: {
                  type: 'test1_type'
                }
              },
              {
                title: 'test2 title',
                url: '/test2_url',
                metadata: {
                  type: 'test2_type'
                }
              },
              {
                title: 'test3 title',
                url: '/test3_url',
                parent: 'parent',
                metadata: {
                  type: 'test3_type'
                }
              },
              {
                title: 'test4 title',
                url: '/test4_url',
                metadata: {
                  type: 'metaschema'
                }
              },
              {
                title: 'test5 title',
                url: '/test5_url',
                metadata: {
                  type: 'test5_type'
                }
              }
            ]
          }
        }
      ).should.deep.equal([
        {
          index: 0,
          title: 'sampleTest',
          path: '#/foo/bar/baz'
        },
        {
          index: 1,
          title: 'test1 title',
          path: '#/test1_url'
        },
        {
          index: 2,
          title: 'test2 title',
          path: '#/test2_url'
        },
        {
          index: 3,
          title: 'test5 title',
          path: '#/test5_url'
        }
      ]);
    });

    it('should return empty menu items array', () => {
      selectors.getSidebarMenuItems({
        schemaReducer: {},
        configReducer: {},
      }).should.deep.equal([]);
    });
  });
});
