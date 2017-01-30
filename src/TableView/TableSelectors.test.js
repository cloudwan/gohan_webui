/* global it, describe */
import chai from 'chai';
import * as selectors from './TableSelectors';

chai.should();

describe('TableSelectors ', () => {
  describe('getActiveSchema() ', () => {
    it('should return test1 schema', () => {
      selectors.getActiveSchema(
        {
          schemaReducer: {
            data: [
              {
                plural: 'test1'
              },
              {
                plural: 'test2'
              }
            ]
          }
        },
        {
          plural: 'test1'
        }
      ).should.deep.equal({
        plural: 'test1'
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
                plural: 'test1',
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
        {
          plural: 'test1'
        }
      ).should.deep.equal([]);

      selectors.getHeaders(
        {
          schemaReducer: {
            data: [
              {
                plural: 'test2',
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
        {
          plural: 'test1'
        }
      ).should.deep.equal([]);
    });

    it('should return correct headers array', () => {
      selectors.getHeaders(
        {
          schemaReducer: {
            data: [
              {
                plural: 'test1',
                schema: {
                  properties: {
                    id: {
                    },
                    name: {
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
        {
          plural: 'test1'
        }
      ).should.deep.equal([
        'name'
      ]);

      selectors.getHeaders(
        {
          schemaReducer: {
            data: [
              {
                plural: 'test1',
                schema: {
                  properties: {
                    id: {
                    },
                    name: {
                    },
                    description: {
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
        {
          plural: 'test1'
        }
      ).should.deep.equal([
        'name',
        'description'
      ]);
    });

    it('should return headers array without excluded \'id\' property', () => {
      selectors.getHeaders(
        {
          schemaReducer: {
            data: [
              {
                plural: 'test1',
                schema: {
                  properties: {
                    id: {
                    },
                    name: {
                    },
                    description: {
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
        {
          plural: 'test1'
        }
      ).should.deep.equal([
        'name',
        'description'
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
        {
          plural: 'test'
        }
      ).should.equal(0);

      selectors.getActivePage(
        {
          tableReducer: {
          },
          configReducer: {
            pageLimit: 10
          }
        },
        {
          plural: 'test'
        }
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
        {
          plural: 'test'
        }
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
        {
          plural: 'test'
        }
      ).should.equal(0);

      selectors.getPageCount(
        {
          tableReducer: {
          },
          configReducer: {
            pageLimit: 10
          }
        },
        {
          plural: 'test'
        }
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
        {
          plural: 'test'
        }
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
        {
          plural: 'test'
        }
      ).should.equal(2);
    });
  });
});
