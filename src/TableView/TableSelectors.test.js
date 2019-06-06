/* global it, describe */
import chai from 'chai';
import * as selectors from './TableSelectors';

chai.should();

describe('TableSelectors ', () => {
  describe('getResourceTitle() ', () => {
    it('should return correct schema title', () => {
      selectors.getResourceTitle(
        {
          schemaReducer: {
            data: [
              {
                id: 'test1',
                title: 'foobarbaz'
              },
              {
                id: 'test2'
              }
            ]
          }
        },
        'test1'
      ).should.equal('foobarbaz');
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
          type: 'string',
          hasRelation: false
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
                    },
                    related: {
                      title: 'related',
                      type: 'string',
                      relation: 'related_id'
                    }
                  },
                  propertiesOrder: [
                    'name',
                    'description',
                    'related'
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
        type: 'string',
        hasRelation: false
      }, {
        id: 'description',
        title: 'title',
        type: 'string',
        hasRelation: false
      }, {
        id: 'related',
        title: 'related',
        type: 'string',
        hasRelation: true
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
        type: 'string',
        hasRelation: false
      }, {
        id: 'description',
        title: 'title',
        type: 'string',
        hasRelation: false
      }
      ]);
    });
  });

  describe('getData() ', () => {
    it('should return data array', () => {
      selectors.getData(
        {
          tableReducer: {
            test1: {
              data: [
                {
                  id: 'test1',
                }
              ]
            }
          }
        },
        'test1'
      ).should.deep.equal([
        {
          id: 'test1',
        }
      ]);
    });
    it('should return empty array', () => {
      selectors.getData(
        {},
        'test1'
      ).should.deep.equal([]);
    });
  });

  describe('getOffset() ', () => {
    it('should return data from store', () => {
      selectors.getOffset(
        {
          tableReducer: {
            test1: {
              offset: 61
            }
          }
        },
        'test1'
      ).should.equal(61);
    });

    it('should return 0', () => {
      selectors.getOffset(
        {
          tableReducer: {}
        },
        'test1'
      ).should.equal(0);
    });
  });

  describe('getActivePage() ', () => {
    it('should return 0', () => {
      selectors.getActivePage(
        {
          tableReducer: {
            test: {
              limit: 10,
              offset: 0
            }
          }
        },
        'test'
      ).should.equal(0);

      selectors.getActivePage(
        {
          tableReducer: {},
        },
        'test'
      ).should.equal(0);
    });

      it('should return 1', () => {
        selectors.getActivePage(
          {
            tableReducer: {
              test: {
                offset: 5,
                limit: 5
              }
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
              totalCount: 0,
              limit: 10
            }
          },
        },
        'test'
      ).should.equal(0);

      selectors.getPageCount(
        {
          tableReducer: {
          },
        },
        'test'
      ).should.equal(0);
    });

    it('should return 1', () => {
      selectors.getPageCount(
        {
          tableReducer: {
            test: {
              totalCount: 10,
              limit: 10
            }
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

  describe('getSortOptions() ', () => {
    it('should return correct sort data from store', () => {
      selectors.getSortOptions(
        {
          tableReducer: {
            test1: {
              sortKey: 'test',
              sortOrder: 'asc'
            }
          }
        },
        'test1'
      ).should.deep.equal({
        sortKey: 'test',
        sortOrder: 'asc'
      });
    });

    it('should return empty sort data', () => {
      selectors.getSortOptions(
        {
          tableReducer: {}
        },
        'test1'
      ).should.deep.equal({
        sortKey: '',
        sortOrder: ''
      });
    });
  });

  describe('getFilters() ', () => {
    it('should return correct filter from store', () => {
      selectors.getFilters(
        {
          tableReducer: {
            test1: {
              filters: [
                {
                  name: 'test'
                }
              ]
            }
          }
        },
        'test1'
      ).should.deep.equal([
        {
          name: 'test'
        }
      ]);
    });

    it('should return empty sort data', () => {
      selectors.getFilters(
        {
          tableReducer: {}
        },
        'test1'
      ).should.deep.equal([]);
    });
  });

  describe('getLimit() ', () => {
    it('should return correct limit from store', () => {
      selectors.getLimit(
        {
          tableReducer: {
            test1: {
              limit: 12
            }
          }
        },
        'test1'
      ).should.equal(12);
    });

    it('should return undefined', () => {
      chai.should(selectors.getLimit(
        {
          tableReducer: {}
        },
        'test1'
      )).equal(undefined);
    });
  });

  describe('getTotalCount() ', () => {
    it('should return correct total count from store', () => {
      selectors.getTotalCount(
        {
          tableReducer: {
            test1: {
              totalCount: 12
            }
          }
        },
        'test1'
      ).should.equal(12);
    });

    it('should return empty 0', () => {
      selectors.getTotalCount(
        {
          tableReducer: {}
        },
        'test1'
      ).should.equal(0);
    });
  });

  describe('getIsLoading() ', () => {
    it('should return correct loading state from store', () => {
      selectors.getIsLoading(
        {
          tableReducer: {
            test1: {
              isLoading: false
            }
          }
        },
        'test1'
      ).should.equal(false);
    });

    it('should return empty 0', () => {
      selectors.getIsLoading(
        {
        },
        'test1'
      ).should.equal(true);
    });
  });


});
