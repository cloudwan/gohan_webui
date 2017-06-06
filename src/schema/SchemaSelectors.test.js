/* global it, describe */
import chai from 'chai';

import * as selectors from './SchemaSelectors';

chai.should();

describe('SchemaSelectors', () => {
  describe('getSidebarMenuItems', () => {
    it('should return appropriate menu items', () => {
      selectors.getSidebarMenuItems(
        {
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
          title: 'test1 title',
          path: '#/test1_url'
        },
        {
          title: 'test2 title',
          path: '#/test2_url'
        },
        {
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

  describe('getSchema', () => {
    it('should return appropriate schema', () => {
      selectors.getSchema(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title',
                url: '/test1_url',
                metadata: {
                  type: 'test1_type'
                }
              },
              {
                id: 'test2',
                title: 'test2 title',
                url: '/test2_url',
                metadata: {
                  type: 'test2_type'
                }
              }
            ]
          }
        }
        , 'test1').should.deep.equal(
        {
          id: 'test1',
          title: 'test1 title',
          url: '/test1_url',
          metadata: {
            type: 'test1_type'
          }
        }
      );
    });

    it('should return empty menu items array', () => {
      selectors.getSidebarMenuItems({
        schemaReducer: {},
        configReducer: {},
      }).should.deep.equal([]);
    });
  });

  describe('hasReadPermission', () => {
    it('should return appropriate value', () => {
      selectors.hasReadPermission(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title',
                url: '/test1_url',
                metadata: {
                  type: 'test1_type'
                },
                schema: {
                  permission: [
                    'read'
                  ]
                }
              }
            ]
          }
        }
        , 'test1').should.equal(true);
    });

    selectors.hasReadPermission(
      {
        schemaReducer: {
          data: [
            {
              id: 'test1',
              title: 'test1 title',
              url: '/test1_url',
              metadata: {
                type: 'test1_type'
              },
              schema: {
                permission: []
              }
            }
          ]
        }
      }
      , 'test1').should.equal(false);
  });

  describe('hasCreatePermission', () => {
    it('should return appropriate value', () => {
      selectors.hasCreatePermission(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title',
                url: '/test1_url',
                metadata: {
                  type: 'test1_type'
                },
                schema: {
                  permission: [
                    'create'
                  ]
                }
              }
            ]
          }
        }
        , 'test1').should.equal(true);
    });

    selectors.hasCreatePermission(
      {
        schemaReducer: {
          data: [
            {
              id: 'test1',
              title: 'test1 title',
              url: '/test1_url',
              metadata: {
                type: 'test1_type'
              },
              schema: {
                permission: []
              }
            }
          ]
        }
      }
      , 'test1').should.equal(false);
  });

  describe('hasUpdatePermission', () => {
    it('should return appropriate value', () => {
      selectors.hasUpdatePermission(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title',
                url: '/test1_url',
                metadata: {
                  type: 'test1_type'
                },
                schema: {
                  permission: [
                    'update',
                  ]
                }
              }
            ]
          }
        }
        , 'test1').should.equal(true);
    });

    selectors.hasUpdatePermission(
      {
        schemaReducer: {
          data: [
            {
              id: 'test1',
              title: 'test1 title',
              url: '/test1_url',
              metadata: {
                type: 'test1_type'
              },
              schema: {
                permission: [
                ]
              }
            }
          ]
        }
      }
      , 'test1').should.equal(false);
  });

  describe('hasDeletePermission', () => {
    it('should return appropriate value', () => {
      selectors.hasDeletePermission(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'test1 title',
                url: '/test1_url',
                metadata: {
                  type: 'test1_type'
                },
                schema: {
                  permission: [
                    'delete'
                  ]
                }
              }
            ]
          }
        }
        , 'test1').should.equal(true);
    });

    selectors.hasDeletePermission(
      {
        schemaReducer: {
          data: [
            {
              id: 'test1',
              title: 'test1 title',
              url: '/test1_url',
              metadata: {
                type: 'test1_type'
              },
              schema: {
                permission: []
              }
            }
          ]
        }
      }
      , 'test1').should.equal(false);
  });
});
