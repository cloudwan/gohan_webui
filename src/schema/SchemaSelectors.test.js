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

  describe('isValidFieldName', () => {
    it('should return appropriate value', () => {
      selectors.isValidFieldName(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                schema: {
                  properties: {
                    name: 'test'
                  }
                }
              }
            ]
          }
        }
        , 'test1', 'name').should.equal(true);
    });

    selectors.isValidFieldName(
      {
        schemaReducer: {
          data: [
            {
              id: 'test1',
              schema: {
                properties: {
                  name: 'test'
                }
              }
            }
          ]
        }
      }
      , 'test1', 'id').should.equal(false);
  });

  describe('getCollectionUrl', () => {
    it('should return appropriate url link', () => {
      selectors.getCollectionUrl(
        {
          schemaReducer: {
            data: [
              {
                id: 'test',
                prefix: '/1.0',
                plural: 'test',
              },
              {
                id: 'test1',
                prefix: '/1.0',
                plural: 'test1',
                parent: 'test'
              },
              {
                id: 'test2',
                prefix: '/1.0',
                plural: 'test2',
                parent: 'test1'
              }
            ]
          }
        }
        , 'test2', {test1_id: '654'}).should.equal('/1.0/test1/654/test2'); // eslint-disable-line camelcase
    });
  });

  describe('getSingularUrl', () => {
    it('should return appropriate url link', () => {
      selectors.getSingularUrl(
        {
          schemaReducer: {
            data: [
              {
                id: 'test',
                prefix: '/1.0',
                plural: 'test',
              },
              {
                id: 'test1',
                prefix: '/1.0',
                plural: 'test1',
                parent: 'test'
              },
              {
                id: 'test2',
                prefix: '/1.0',
                plural: 'test2',
                parent: 'test1'
              }
            ]
          }
        }
        , 'test2', {
          test_id: '542', // eslint-disable-line camelcase
          test1_id: '312', // eslint-disable-line camelcase
          test2_id: '654', // eslint-disable-line camelcase
        }).should.equal('/1.0/test/542/test1/312/test2/654'); // eslint-disable-line camelcase
    });

    it('should return appropriate url link', () => {
      selectors.getSingularUrl(
        {
          schemaReducer: {
            data: [
              {
                id: 'test',
                prefix: '/1.0',
                plural: 'test',
              },
              {
                id: 'test1',
                prefix: '/1.0',
                plural: 'test1',
                parent: 'test'
              },
              {
                id: 'test2',
                prefix: '/1.0',
                plural: 'test2',
                parent: 'test1'
              }
            ]
          }
        }
        , 'test2', {test2_id: '654'}).should.equal('/1.0/test2/654'); // eslint-disable-line camelcase
    });
  });
});
