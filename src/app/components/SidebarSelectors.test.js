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
                plural: 'test1_plural',
                metadata: {
                  type: 'test1_type'
                }
              },
              {
                title: 'test2 title',
                plural: 'test2_plural',
                metadata: {
                  type: 'test2_type'
                }
              },
              {
                title: 'test3 title',
                plural: 'test3_plural',
                parent: 'parent',
                metadata: {
                  type: 'test3_type'
                }
              },
              {
                title: 'test4 title',
                plural: 'test4_plural',
                metadata: {
                  type: 'metaschema'
                }
              },
              {
                title: 'test5 title',
                plural: 'test5_plural',
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
          path: '#/test1_plural'
        },
        {
          index: 2,
          title: 'test2 title',
          path: '#/test2_plural'
        },
        {
          index: 3,
          title: 'test5 title',
          path: '#/test5_plural'
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
