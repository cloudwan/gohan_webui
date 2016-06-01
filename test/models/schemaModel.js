/* global describe, it, beforeEach, afterEach */
import proxyquire from 'proxyquire';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';

chai.should();
chai.use(chaiAsPromised);

const backbone = {
  Model: class {
    constructor(attributes, options) {
      this.attributes = Object.assign({}, attributes);
      this.collection = options.collection;
    }
    get(key) {
      return this.attributes[key];
    }
    set(key, param) {
      this.attributes[key] = param;
    }
    toJSON() {
      return this.attributes;
    }
  },
  Collection: class {
    constructor(options) {
      this.collections = options.collections;

      for (let key in options.collections) {
        this.collections[key] = new SchemaModel(options.collections[key],
          {collection: {}}
        );
      }

      this.baseUrl = options.baseUrl;
    }
    get(param) {
      return this.collections[param];
    }
    filter(callback) {
      const result = [];

      for (let key in this.collections) {
        if (callback(this.collections[key])) {
          result.push(this.collections[key]);
        }
      }
      return result;
    }
    get userModel() {
      return {
        authToken() {
          return 'token';
        }
      };
    }
  }
};
const SchemaModel = proxyquire('./../../app/js/models/schemaModel', {
  backbone
}).default;

const collection = new backbone.Collection({
  baseUrl: 'http://localhost:9091',
  collections: {
    sampleParent: {
      singular: 'sample_singular',
      plural: 'sample_plural',
      url: 'sample_url'
    }
  }
});

describe('SchemaModel ', () => {
  describe('#constructor()', () => {
    it('shouldn\'t throw error', () => {
      chai.expect(() => {
        new SchemaModel({}, {collection});
      }).to.not.throw(Error);
    });
  });

  describe('#apiEndpoint()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {
          url: '/gohan/v0.1/namespaces'
        },
        {
          collection
        }
      );
    });

    it('should return correct api endpoint', () => {
      model.apiEndpoint().should.be.equal('http://localhost:9091/gohan/v0.1/namespaces');
    });
  });

  describe('#apiEndpointBase()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel({}, {collection});
    });

    it('should return correct endpoint base', () => {
      model.apiEndpointBase().should.be.equal('http://localhost:9091');
    });
  });

  describe('#detailPath()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {
          prefix: '/gohan/v0.1'
        },
        {
          collection
        }
      );
    });

    it('should return detail path', () => {
      model.detailPath('_sample_id_').should.be.equal('/gohan/v0.1/_sample_id_');
    });
  });

  describe('#url()', () => {
    let model;

    it('should return correct url', () => {
      model = new SchemaModel(
        {
          url: '/gohan/v0.1/namespaces'
        },
        {
          collection
        }
      );

      model.url().should.be.equal('/gohan/v0.1/namespaces');
    });
  });

  describe('#parent()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {
          parent: 'sampleParent'
        },
        {
          collection
        }
      );
    });

    it('should return correct parent', () => {
      model.parent().should.be.deep.equal({
        attributes: {
          plural: 'sample_plural',
          singular: 'sample_singular',
          url: 'sample_url'
        },
        collection: {}
      });
    });
  });

  describe('#parentProperty()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {
          parent: 'sampleParent'
        },
        {
          collection
        }
      );
    });

    it('should return correct parent property', () => {
      model.parentProperty().should.be.equal('sampleParent_id');
    });
  });

  describe('#hasParent()', () => {
    it('should return true when have parent', () => {
      let model = new SchemaModel(
        {
          parent: 'sampleParent'
        },
        {
          collection
        }
      );
      model.hasParent().should.be.true;
    });

    it('should return false when haven\'t parent', () => {
      let model = new SchemaModel(
        {
        },
        {
          collection
        }
      );
      model.hasParent().should.be.false;
    });

    it('should return false when parent property is empty string', () => {
      let model = new SchemaModel(
        {
          parent: ''
        },
        {
          collection
        }
      );
      model.hasParent().should.be.false;
    });
  });

  describe('#makeModel()', () => {
    it('should return new model class');
  });

  describe('#makeCollection()', () => {
    it('should return new collection class');
  });

  describe('#toLocalSchema()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {
          url: '/gohan/v0.1/namespaces'
        },
        {
          collection
        }
      );
    });

    afterEach(() => {
      global.fetch = undefined;
    });

    it('should return promise', () => {
      const schema = {};

      model.toLocalSchema(schema).should.be.a('promise');
    });

    it('should resolve promise with empty object', done => {
      const schema = {};

      model.toLocalSchema(schema).should.be.eventually.deep.equal({}).notify(done);
    });

    it('should resolve promise with correct object', done => {
      const schema = {
        type: 'object'
      };

      model.toLocalSchema(schema).should.be.eventually.deep.equal({
        format: 'yaml',
        originalType: 'object',
        type: 'object'
      }).notify(done);
    });

    it('should resolve promise with correct object', done => {
      const schema = {
        type: ['object']
      };

      model.toLocalSchema(schema).should.be.eventually.deep.equal({
        format: 'yaml',
        originalType: 'object',
        type: 'object'
      }).notify(done);
    });

    it('should resolve promise with correct object', done => {
      const schema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name'
          }
        }
      };

      model.toLocalSchema(schema).should.be.eventually.deep.equal({
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name'
          }
        }
      }).notify(done);
    });

    it('should resolve promise with correct object', done => {
      const schema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name'
          },
          params: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      };

      model.toLocalSchema(schema).should.be.eventually.deep.equal({
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name'
          },
          params: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }).notify(done);
    });

    it('should resolve promise with correct object', done => {
      const schema = {
        type: 'object',
        items: {
          type: 'string'
        }
      };

      model.toLocalSchema(schema).should.be.eventually.deep.equal({
        type: 'array',
        items: {
          properties: {
            id: {
              title: 'key',
              type: 'string'
            },
            value: {
              title: 'value',
              type: 'string'
            }
          },
          required: undefined,
          type: 'object'
        }
      }).notify(done);
    });

    it('should resolve promise with correct object', done => {
      const schema = {
        type: 'object',
        items: {
          items: {
            type: 'string'
          },
          type: 'object'
        }
      };

      model.toLocalSchema(schema).should.be.eventually.deep.equal({
        type: 'array',
        items: {
          properties: {
            id: {
              title: 'key',
              type: 'string'
            },
            value: {
              items: {
                properties: {
                  id: {
                    title: 'key',
                    type: 'string'
                  },
                  value: {
                    title: 'value',
                    type: 'string'
                  }
                },
                required: undefined,
                type: 'object'
              },
              title: 'value',
              type: 'array'
            }
          },
          required: undefined,
          type: 'object'
        }

      }).notify(done);
    });

    it('should resolve promise with correct object', done => {
      const schema = {
        type: 'object',
        properties: {
          parent: {
            relation: 'sampleParent'
          }
        }
      };

      global.fetch = () => {
        return new Promise(resolve => {
          const response = {
            json() {
              return {
                parent: [
                  {
                    id: 'sampleIdFoo',
                    name: 'sample_name_bar'
                  }
                ]
              };
            }
          };

          resolve(response);
        });
      };

      model.toLocalSchema(schema).should.be.eventually.deep.equal(
        {
          properties: {
            parent: {
              enum: [
                'sampleIdFoo'
              ],
              options: {
                sampleIdFoo: 'sample_name_bar'
              },
              relation: 'sampleParent'
            }
          },
          type: 'object'
        }
      ).notify(done);
    });

    it('should reject promise by fetch error', done => {
      const schema = {
        type: 'object',
        properties: {
          parent: {
            relation: 'sampleParent'
          }
        }
      };

      global.fetch = () => {
        return new Promise((resolve, reject) => {
          reject(new Error());
        });
      };

      model.toLocalSchema(schema).should.be.rejectedWith(Error).notify(done);
    });
  });

  describe('#defaultValue()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {},
        {
          collection
        }
      );
    });

    it('should return default values', () => {
      const schema = {
        type: 'object',
        default: {
          name: 'test_name',
          id: 'test_id'
        }
      };

      model.defaultValue(schema).should.be.deep.equal({
        name: 'test_name',
        id: 'test_id'
      });
    });

    it('should return default value', () => {
      const schema = {
        type: 'string',
        default: 'foobarbaz'
      };

      model.defaultValue(schema).should.be.equal('foobarbaz');
    });

    it('should return default value', () => {
      const schema = {
        type: 'object',
        properties: {
          description: {
            default: 'SampleDescription',
            type: 'string'
          },
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          }
        }
      };

      model.defaultValue(schema).should.be.deep.equal(
        {
          description: 'SampleDescription',
          id: undefined,
          name: undefined
        }
      );
    });
  });

  describe('#toLocal()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {},
        {
          collection
        }
      );
    });

    it('should return data', () => {
      const schema = {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          }
        }
      };
      const data = {
        name: 'foobar'
      };

      model.set('schema', schema);

      model.toLocal(data).should.be.deep.equal(data);
    });

    it('should return undefined', () => {
      const schema = {
        type: 'string'
      };

      model.set('schema', schema);

      chai.expect(model.toLocal(undefined)).to.be.undefined;
    });
  });

  describe('#toLocalData()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {
          schema: {}
        },
        {
          collection
        }
      );
    });

    it('should return data', () => {
      const schema = {
        type: 'string'
      };
      const data = {
        name: 'foobar'
      };

      model.toLocalData(schema, data).should.be.deep.equal(data);
    });

    it('should return data', () => {
      const schema = {
        type: 'object'
      };
      const data = {
        name: 'foobar'
      };

      model.toLocalData(schema, data).should.be.deep.equal('name: foobar\n');
    });

    it('should return data', () => {
      const schema = {
        type: 'object',
        format: 'jsonschema',
      };
      const data = {
        name: 'foobar'
      };

      model.toLocalData(schema, data).should.be.deep.equal('name: foobar\n');
    });

    it('should return data', () => {
      const schema = {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          }
        }
      };
      const data = {
        name: 'foobar'
      };

      model.toLocalData(schema, data).should.be.deep.equal(data);
    });

    it('should return data', () => {
      const schema = {
        type: 'object',
        items: {
          name: {
            type: 'string'
          }
        }
      };
      const data = {
        name: 'foobar'
      };

      model.toLocalData(schema, data).should.be.deep.equal([
        {
          id: 'name',
          value: 'foobar'
        }
      ]);
    });

    it('should return data', () => {
      const schema = {
        type: 'object',
        items: {
          propertiesOrder: ['name'],
          name: {
            type: 'string'
          }
        }
      };
      const data = {
        name: 'foobar'
      };

      model.toLocalData(schema, data).should.be.deep.equal([
        {
          id: 'name',
          value: 'foobar'
        }
      ]);
    });

    it('should return undefined', () => {
      const schema = {
        type: 'object'
      };

      chai.expect(model.toLocalData(schema)).to.be.undefined;
    });



  });

  describe('#toServer()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {
          schema: {
            properties: {
              name: {
                type: 'string'
              }
            }
          }
        },
        {
          collection
        }
      );
    });
    it('should return correct data', () => {
      const data = {name: 'foo'};

      model.toServer(data).should.be.deep.equal({name: 'foo'});
    });
  });

  describe('#toServerData()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {
        },
        {
          collection
        }
      );
    });

    it('should return correct data', () => {
      const schema = {
        type: 'string'
      };
      const data = {
        name: 'foo'
      };

      model.toServerData(schema, data).should.be.equal(data);
    });

    it('should return correct data', () => {
      const schema = {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          }
        }
      };
      const data = {
        id: '123321123321',
        name: 'foo'
      };

      model.toServerData(schema, data).should.be.deep.equal({
        name: 'foo'
      });
    });

    it('should return correct data', () => {
      const schema = {
        type: 'object',
        properties: {
          name: {
            items: {
              type: 'string'
            },
            type: 'object'
          }
        }
      };
      const data = {
        name: [
          {
            id: 0,
            value: 'test'
          }
        ]
      };

      model.toServerData(schema, data).should.be.deep.equal({
        name: {
          0: 'test'
        }
      });
    });

    it('should return correct data', () => {
      const schema = {
        type: 'object'
      };
      const data = '{name: \'foo\'}';

      model.toServerData(schema, data).should.be.deep.equal({name: 'foo'});
    });

    it('should return undefined', () => {
      const schema = {
        type: 'object'
      };

      chai.expect(model.toServerData(schema)).to.be.undefined;
    });
  });

  describe('#filterByAction()', () => {
    let model;

    afterEach(() => {
      model = undefined;
    });

    it('should return promise', () => {
      model = new SchemaModel(
        {
          schema: {
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create').should.be.a('promise');
    });

    it('should return promise and resolve', done => {
      model = new SchemaModel(
        {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                permission: [
                  'create',
                  'update'
                ]
              }
            }
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create').should.be.eventually.deep.equal(
        {
          properties: {
            name: {
              permission: [
                'create',
                'update'
              ],
              type: 'string'
            }
          },
          propertiesOrder: undefined,
          required: [],
          type: 'object'
        }
      ).notify(done);
    });

    it('should return promise and resolve', done => {
      model = new SchemaModel(
        {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                permission: [
                  'create'
                ],
                format: 'uuid'
              },
              name: {
                type: 'string',
                permission: [
                  'create',
                  'update'
                ]
              }
            }
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create').should.be.eventually.deep.equal(
        {
          properties: {
            name: {
              permission: [
                'create',
                'update'
              ],
              type: 'string'
            }
          },
          propertiesOrder: undefined,
          required: [],
          type: 'object'
        }
      ).notify(done);
    });

    it('should return promise and resolve', done => {
      model = new SchemaModel(
        {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                permission: [
                  'create'
                ],
                format: 'uuid'
              },
              name: {
                type: 'string'
              }
            }
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create').should.be.eventually.deep.equal(
        {
          properties: {},
          propertiesOrder: undefined,
          required: [],
          type: 'object'
        }
      ).notify(done);
    });

    it('should return promise and resolve', done => {
      model = new SchemaModel(
        {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                permission: [
                  'create'
                ],
                format: 'uuid'
              },
              name: {
                type: 'string',
                permission: [
                  'create'
                ]
              },
              parent: {
                type: 'string',
                permission: [
                  'create'
                ]
              }
            }
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create', 'parent').should.be.eventually.deep.equal(
        {
          properties: {
            name: {
              permission: [
                'create'
              ],
              type: 'string'
            }
          },
          propertiesOrder: undefined,
          required: [],
          type: 'object'
        }
      ).notify(done);
    });

    it('should return promise and resolve', done => {
      model = new SchemaModel(
        {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                permission: [
                  'create'
                ],
                format: 'uuid'
              },
              name: {
                type: 'string',
                permission: [
                  'create'
                ]
              },
              subname: {
                type: 'string',
                view: [
                  'update'
                ],
                permission: [
                  'create'
                ]
              }
            }
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create').should.be.eventually.deep.equal(
        {
          properties: {
            name: {
              permission: [
                'create'
              ],
              type: 'string'
            }
          },
          propertiesOrder: undefined,
          required: [],
          type: 'object'
        }
      ).notify(done);
    });

    it('should return promise and resolve', done => {
      model = new SchemaModel(
        {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                permission: [
                  'create'
                ],
                format: 'uuid'
              },
              name: {
                type: 'string',
                permission: [
                  'create'
                ]
              },
              subname: {
                type: 'string',
                permission: [
                  'update'
                ]
              }
            }
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create').should.be.eventually.deep.equal(
        {
          properties: {
            name: {
              permission: [
                'create'
              ],
              type: 'string'
            }
          },
          propertiesOrder: undefined,
          required: [],
          type: 'object'
        }
      ).notify(done);
    });

    it('should return promise and resolve', done => {
      model = new SchemaModel(
        {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                permission: [
                  'create'
                ],
                format: 'uuid'
              },
              name: {
                type: 'string',
                permission: [
                  'create'
                ]
              },
              subname: {
                type: 'string',
                view: [
                  'create'
                ],
                permission: [
                  'create'
                ]
              }
            }
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create').should.be.eventually.deep.equal(
        {
          properties: {
            name: {
              permission: [
                'create'
              ],
              type: 'string'
            },
            subname: {
              permission: [
                'create'
              ],
              type: 'string',
              view: [
                'create'
              ]
            }
          },
          propertiesOrder: undefined,
          required: [],
          type: 'object'
        }
      ).notify(done);
    });

    it('should return promise and resolve', done => {
      model = new SchemaModel(
        {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                permission: [
                  'create'
                ],
                format: 'uuid'
              },
              name: {
                type: 'string',
                permission: [
                  'create'
                ]
              },
              subname: {
                type: 'string',
                view: [
                  'update'
                ],
                permission: [
                  'create'
                ]
              }
            },
            required: [
              'name'
            ]
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create').should.be.eventually.deep.equal(
        {
          properties: {
            name: {
              permission: [
                'create'
              ],
              type: 'string'
            }
          },
          propertiesOrder: undefined,
          type: 'object',
          required: [
            'name'
          ]
        }
      ).notify(done);
    });

    it('should return promise and resolve', done => {
      global.fetch = () => {
        return new Promise((resolve, reject) => {
          reject(new Error());
        });
      };

      model = new SchemaModel(
        {
          schema:
          {
            type: 'object',
            properties: {
              parent: {
                relation: 'sampleParent'
              }
            }
          }
        },
        {
          collection
        }
      );
      model.filterByAction('create').should.be.rejectedWith(Error).notify(done);
    });

  });

  describe('#children()', () => {
    let model;

    beforeEach(() => {
      model = new SchemaModel(
        {
        },
        {
          collection
        }
      );
    });

    it('should return children', () => {
      model.children().should.be.deep.equal(
        [
          {
            attributes: {
              plural: 'sample_plural',
              singular: 'sample_singular',
              url: 'sample_url'
            },
            collection: {}
          }
        ]
      );
    });
  });
});
