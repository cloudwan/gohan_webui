/* global it, describe */
import chai from 'chai';
import * as selectors from './TableSelectors';

chai.should();

describe('TableSelectors ', () => {
  describe('getSchema() ', () => {
    it('should return test1 schema', () => {
      selectors.getSchema(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1'
              },
              {
                id: 'test2'
              }
            ]
          }
        },
        'test1'
      ).should.deep.equal({
        id: 'test1'
      });
    });
  });

  describe('getHeaders() ', () => {
    it('should return empty array', () => {
      selectors.getHeaders(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                schema: {
                  properties: {},
                  propertiesOrder: [
                    'name',
                    'description'
                  ]
                }
              }
            ]
          }
        },
        'test1'
      ).should.deep.equal([]);

      selectors.getHeaders(
        {
          schemaReducer: {
            data: [
              {
                id: 'test2',
                schema: {
                  properties: {},
                  propertiesOrder: [
                    'name',
                    'description'
                  ]
                }
              }
            ]
          }
        },
        'test1'
      ).should.deep.equal([]);
    });

    it('should return correct headers array', () => {
      selectors.getHeaders(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                schema: {
                  properties: {
                    id: {
                    },
                    name: {
                      title: 'title',
                      type: 'string',
                    },
                    description: {
                      view: [
                        'detail'
                      ]
                    }
                  },
                  propertiesOrder: [
                    'name',
                    'description'
                  ]
                }
              }
            ]
          }
        },
        'test1'
      ).should.deep.equal([
        {
          id: 'name',
          title: 'title',
          type: 'string'
        }
      ]);

      selectors.getHeaders(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                schema: {
                  properties: {
                    id: {
                    },
                    name: {
                      title: 'title',
                      type: 'string'
                    },
                    description: {
                      title: 'title',
                      type: 'string',
                      view: [
                        'list'
                      ]
                    }
                  },
                  propertiesOrder: [
                    'name',
                    'description'
                  ]
                }
              }
            ]
          }
        },
        'test1'
      ).should.deep.equal([{
        id: 'name',
        title: 'title',
        type: 'string'
      }, {
        id: 'description',
        title: 'title',
        type: 'string'
      }
      ]);
    });

    it('should return headers array without excluded \'id\' property', () => {
      selectors.getHeaders(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                schema: {
                  properties: {
                    id: {
                    },
                    name: {
                      title: 'title',
                      type: 'string'
                    },
                    description: {
                      title: 'title',
                      type: 'string',
                      view: [
                        'list'
                      ]
                    }
                  },
                  propertiesOrder: [
                    'id',
                    'name',
                    'description'
                  ]
                }
              }
            ]
          }
        },
        'test1'
      ).should.deep.equal([{
        id: 'name',
        title: 'title',
        type: 'string'
      }, {
        id: 'description',
        title: 'title',
        type: 'string'
      }
      ]);
    });
  });

  describe('getActivePage() ', () => {
    it('should return 0', () => {
      selectors.getActivePage(
        {
          tableReducer: {
            test: {
              totalCount: 10,
              offset: 0
            }
          },
          configReducer: {
            pageLimit: 10
          }
        },
        'test'
      ).should.equal(0);

      selectors.getActivePage(
        {
          tableReducer: {
          },
          configReducer: {
            pageLimit: 10
          }
        },
        'test'
      ).should.equal(0);
    });

    it('should return 1', () => {
      selectors.getActivePage(
        {
          tableReducer: {
            test: {
              totalCount: 10,
              offset: 5
            }
          },
          configReducer: {
            pageLimit: 10
          }
        },
        'test'
      ).should.equal(1);
    });
  });

  describe('getPageCount() ', () => {
    it('should return 0', () => {
      selectors.getPageCount(
        {
          tableReducer: {
            test: {
              totalCount: 0
            }
          },
          configReducer: {
            pageLimit: 10
          }
        },
        'test'
      ).should.equal(0);

      selectors.getPageCount(
        {
          tableReducer: {
          },
          configReducer: {
            pageLimit: 10
          }
        },
        'test'
      ).should.equal(0);
    });

    it('should return 1', () => {
      selectors.getPageCount(
        {
          tableReducer: {
            test: {
              totalCount: 10
            }
          },
          configReducer: {
            pageLimit: 10
          }
        },
        'test'
      ).should.equal(1);
    });
    it('should return 2', () => {
      selectors.getPageCount(
        {
          tableReducer: {
            test: {
              totalCount: 10,
              limit: 5

            }
          },
          configReducer: {
            pageLimit: 10
          }
        },
        'test'
      ).should.equal(2);
    });
  });
});
