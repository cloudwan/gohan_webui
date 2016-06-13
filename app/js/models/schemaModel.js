/* global fetch */
import {Model, Collection} from 'backbone';
import jsyaml from 'js-yaml';

/**
 * Class contains logic of schema model in application.
 * @class SchemaModel
 * @extends Model
 */
export default class SchemaModel extends Model {
  collections() {
    return [];
  }

  /**
   * Returns API endpoint.
   * @returns {string}
   */
  apiEndpoint() {
    return this.apiEndpointBase() + this.get('url');
  }

  /**
   * Returns base API endpoint.
   * @returns {string}
   */
  apiEndpointBase() {
    return this.collection.baseUrl;
  }

  /**
   * Returns detail path.
   * @returns {string}
   */
  detailPath(id) {
    return this.get('prefix') + '/' + id;
  }

  /**
   * Returns full url.
   * @returns {string}
   */
  url() {
    if (!this.hasParent()) {
      return this.get('url');
    }

    const parentSchema = this.parent();

    return parentSchema.url() + '/:' + parentSchema.get('singular') + '/' + this.get('plural');
  }

  /**
   * Returns schema parent.
   * @returns {Model}
   */
  parent() {
    return this.collection.get(this.get('parent'));
  }

  /**
   * Returns parent property.
   * @returns {string}
   */
  parentProperty() {
    return this.get('parent') + '_id';
  }

  /**
   * Returns true if schema has parent otherwise false.
   * @returns {boolean}
   */
  hasParent() {
    return this.get('parent') !== undefined && this.get('parent') !== '';
  }

  /**
   * Returns new model class.
   * @param baseUrl
   * @returns {any}
   */
  makeModel(baseUrl = this.apiEndpoint()) {
    const self = this;
    const userModel = this.collection.userModel;

    return class DataModel extends Model {

      /**
       * Constructs the object.
       * @constructor
       * @extends Model.constructor
       * @param {Object} options
       */
      constructor(options) {
        super(options);
        this.schema = self;
        this.baseUrl = baseUrl;
        this.url = this.baseUrl;
      }

      /**
       * Returns state of isNew, true when model is new otherwise false.
       * @returns {boolean}
       */
      isNew() {
        return Boolean(this.get('isNew'));
      }

      /**
       * Destroys object.
       * @extend Model.destroy
       * @param {Object} options
       * @returns {Promise}
       */
      destroy(options = {}) {
        return new Promise((resolve, reject) => {
          super.destroy(Object.assign({
            success: (...params) => {
              resolve(params);
            },
            error: (...params) => {
              reject(params);
            }
          }, options));
        });
      }

      /**
       * Saves model data.
       * @extend Model.save
       * @param {Model} model
       * @param {Object} options
       * @returns {Promise}
       */
      save(model, options = {}) {
        return new Promise((resolve, reject) => {
          super.save(model, Object.assign({
            success: (...params) => {
              resolve(params);
            },
            error: (...params) => {
              reject(params);
            }
          }, options));
        });
      }

      /**
       * Fetches data from server
       * @extend Model.fetch
       * @param {Object} options
       * @returns {Promise}
       */
      fetch(options = {}) {
        return new Promise((resolve, reject) => {
          super.fetch(Object.assign({
            success: (...params) => {
              resolve(params);
            },
            error: (...params) => {
              reject(params);
            }
          }, options));
        });
      }

      /**
       * Parses data from the server.
       * @override Model.parse
       * @param {Object} resp
       * @returns {Object}
       */
      parse(resp) {
        if (resp.id === undefined) {
          return resp[self.get('singular')];
        }
        return resp;
      }

      /**
       * Syncs model data.
       * @extends Model.sync
       * @param method
       * @param model
       * @param options
       */
      sync(method, model, options = {}) {
        if (!this.isNew()) {
          this.url = this.baseUrl + '/' + this.id;
        }

        if (method === 'patch') {
          method = 'update';
        }

        options.headers = {
          'X-Auth-Token': userModel.authToken(),
          'Content-Type': 'application/json'
        };
        this.unset('isNew');

        const data = {};

        const cloneOfModel = model.clone();
        const modelJSON = {};

        this.schema.filterByAction(method).then(schemaForAction => {
          for (let key in schemaForAction.properties) {
            modelJSON[key] = cloneOfModel.get(key);
          }

          data[this.schema.get('singular')] = modelJSON;
          options.data = JSON.stringify(data);
          super.sync(method, model, options);
        });
      }

      /**
       * Returns parent id of model.
       * @returns {string | undefined}
       */
      parentId() {
        if (this.schema.hasParent()) {
          return this.get(this.schema.parentProperty());
        }
        return undefined;
      }

      /**
       * Returns path fragment.
       * @returns {string}
       */
      fragment() {
        return this.schema.detailPath(this.id).substr(1);
      }

      /**
       * Returns ancestors.
       * @param {function} callback
       * @param {Array} ancestors
       */
      getAncestors(callback, ancestors = []) {
        if (!this.schema.hasParent()) {
          callback(ancestors);
          return;
        }

        if (this.parentId() === undefined) {
          return;
        }

        const parentModelClass = this.schema.parent().makeModel();
        const parentModel = new parentModelClass({id: this.parentId()});

        parentModel.fetch().then(() => {
          ancestors.push(parentModel);
          parentModel.getAncestors(callback, ancestors);
        });
      }
    };
  }

  /**
   * Returns new collection of models.
   * @param {string} url
   * @returns {CollectionClass}
   */
  makeCollection(url = this.apiEndpoint()) {
    if (this.collections[url]) {
      return this.collections[url];
    }

    const model = this.makeModel(url);
    const userModel = this.collection.userModel;
    const additionalForms = this.collection.additionalForms;
    const addingRelationDialog = this.collection.addingRelationDialog;
    const pageLimit = this.collection.pageLimit;
    const self = this;

    if (additionalForms !== undefined && additionalForms[this.id] === undefined) {
      this.additionalForm = additionalForms[self.id];
    } else {
      this.additionalForm = ['*'];
    }

    if (addingRelationDialog) {
      this.addingRelationDialog = addingRelationDialog;
    }

    class CollectionClass extends Collection {

      /**
       * Constructs the object.
       * @constructor
       * @extends Collection.constructor
       * @param {Object} options
       */
      constructor(options) {
        super(options);

        this.pageLimit = ~~pageLimit;
        this.total = 0;
        this.offset = 0;
        this.sortKey = 'id';
        this.sortOrder = 'asc';
        this.baseUrl = url;
        this.model = model;
        this.schema = self;
        this.filters = {};
        this.longPolling = false;
        this.timeOutId = -1;
        this.intervalSeconds = 10;
        this.updateUrl();
      }

      /**
       * Updates collection url to filter, sort and paging.
       */
      updateUrl() {
        let filter = '';

        for (let key in this.filters) {
          if (this.filters.hasOwnProperty(key)) {
            filter += '&' + key + '=' + this.filters[key];
          }
        }

        this.url = this.baseUrl + '?sort_key=' + this.sortKey + '&sort_order=' + this.sortOrder +
          '&limit=' + this.pageLimit + '&offset=' + this.offset + filter;
      }

      /**
       * Sorts by specified key and specified order (asc or desc).
       * @param {string} key
       * @param {string} order
       * @returns {Promise}
       */
      sort(key = 'id', order = 'asc') {
        return new Promise((resolve, reject) => {
          this.sortKey = key;
          this.sortOrder = order;
          this.updateUrl();

          this.fetch().then(resolve, reject);
        });
      }

      resetFilters() {
        this.filters = {};
        this.updateUrl();
      }

      filter(property, value) {
        return new Promise((resolve, reject) => {
          if (property === undefined) {
            this.filters = {};
          } else if (value === undefined) {
            delete this.filters[property];
          } else {
            this.filters[property] = value;
          }
          this.offset = 0;
          this.updateUrl();

          this.fetch().then(resolve, reject);
        });
      }

      /**
       * Returns count of pages.
       * @returns {number}
       */
      getPageCount() {
        return Math.ceil(this.total / this.pageLimit);
      }

      /**
       * Updates collection data to data from specified page.
       * @param {number} pageNo
       * @returns {Promise}
       */
      getPage(pageNo = 0) {
        return new Promise((resolve, reject) => {
          const offset = this.pageLimit * pageNo;

          if (offset > this.total || offset < 0) {
            reject('Wrong page number!');
            return;
          }

          this.offset = offset;
          this.updateUrl();

          this.fetch().then(resolve, reject);
        });
      }

      /**
       * Updated collection data to next page.
       * @returns {Promise}
       */
      getNextPage() {
        return new Promise((resolve, reject) => {
          const offset = this.offset + this.pageLimit;
          if (offset >= this.total) {
            reject('This was last page!');
            return;
          }

          this.offset = offset;
          this.updateUrl();

          this.fetch().then(resolve, reject);
        });
      }

      /**
       * Updated collection data to prev page.
       * @returns {Promise}
       */
      getPrevPage() {
        return new Promise((resolve, reject) => {
          const offset = this.offset - this.pageLimit;
          if (offset < 0) {
            reject('This was first page!');
            return;
          }

          this.offset = offset;
          this.updateUrl();

          this.fetch().then(resolve, reject);
        });
      }

      /**
       * Fetches data from server.
       * @extend Collection.fetch
       * @param {Object} options
       * @returns {Promise}
       */
      fetch(options) {
        return new Promise((resolve, reject) => {
          super.fetch(Object.assign({
            success: (...params) => {
              resolve(params);
            },
            error: (...params) => {
              reject(params);
            }
          }, options));
        });
      }

      /**
       * Removes data from server.
       * @extend Collection.remove
       * @param {Model} model
       * @param {Object} options
       * @returns {Promise}
       */
      remove(model, options) {
        return new Promise((resolve, reject) => {
          super.remove(model, Object.assign({
            success: (...params) => {
              resolve(params);
            },
            error: (...params) => {
              reject(params);
            }
          }, options));
        });
      }

      /**
       * Creates data from server.
       * @extend Collection.create
       * @param {Model} model
       * @param {Object} options
       * @returns {Promise}
       */
      create(model, options) {
        return new Promise((resolve, reject) => {
          super.create(model, Object.assign({
            success: (...params) => {
              resolve(params);
            },
            error: (...params) => {
              reject(params);
            }
          }, options));
        });
      }

      /**
       * Parses response from the server.
       * @override Collection.parse
       * @param {Object} resp
       * @param {Object} options
       * @returns {Object}
       */
      parse(resp, options) {
        this.total = Number(options.xhr.getResponseHeader('X-Total-Count'));

        return resp[self.get('plural')];
      }

      /**
       * Loges out user.
       */
      unsetAuthData() {
        this.userModel.unsetAuthData();
      }

      /**
       * Starts long polling.
       * @param {number} intervalSeconds
       */
      startLongPolling(intervalSeconds) {
        this.longPolling = true;

        if (intervalSeconds) {
          this.intervalSeconds = intervalSeconds;
        }
        this.executeLongPolling();
      }

      /**
       * Stops long polling.
       */
      stopLongPolling() {
        this.longPolling = false;
        clearTimeout(this.timeOutId);
        this.timeOutId = -1;
      }

      /**
       * Fetches data from server.
       */
      executeLongPolling() {
        const fetchSuccess = () => {
          if (this.longPolling) {
            this.timeOutId = setTimeout(
              this.executeLongPolling.bind(this),
              1000 * this.intervalSeconds
            );
          }
        };

        this.fetch().then(fetchSuccess);
      }

      /**
       * Syncs model data.
       * @extends Collection.sync
       * @param {string} method
       * @param {Object} collection
       * @param {Object} options
       */
      sync(method, collection, options = {}) {
        options.headers = {
          'X-Auth-Token': userModel.authToken(),
          'Content-Type': 'application/json'
        };
        super.sync(method, collection, options);
      }
    }

    const collection = new CollectionClass();

    self.collections[url] = collection;
    return collection;
  }
  toFormJSON(json) {
    const schema = {};

    for (let key in json.properties) {
      if (json.propertiesOrder !== undefined) {
        if (!json.propertiesOrder.includes(key)) {
          continue;
        }
      }

      const value = json.properties[key];

      schema[key] = {
        title: value.title,
        type: 'Text',
        help: value.description,
        validators: []
      };

      if (value.relation) {
        schema[key].relation = value.relation;
      }

      if (value.type === 'string') {
        if (value.enum !== undefined) {
          schema[key].type = 'Select';
          schema[key].options = [];

          if (value.options !== undefined) {
            schema[key].options = value.options;
          } else {
            schema[key].options = value.enum;
          }
        } else if (value.format !== undefined &&
          (value.format === 'yaml' || value.format === 'javascript')) {
          schema[key].format = value.format;
          schema[key].type = 'CodeEditor';
        } else {
          schema[key].type = 'Text';
        }
      } else if (value.type === 'integer' || value.type === 'number') {
        schema[key].type = 'Number';
      } else if (value.type === 'array') {
        schema[key].type = 'List';
        schema[key].default = this.defaultValue(value.items);
        if (value.items.type === 'object') {
          schema[key].itemType = 'Object';
          schema[key].order = value.items.propertiesOrder;
          schema[key].subSchema = this.toFormJSON(value.items);
        } else if (value.items.type === 'boolean') {
          schema[key].itemType = 'Checkbox';
        } else if (value.items.type === 'number' || value.items.type === 'integer') {
          schema[key].itemType = 'Number';
        } else if (value.items.type === 'string') {
          if (value.items.enum !== undefined) {
            schema[key].itemType = 'Select';
            schema[key].options = [];

            if (value.items.options !== undefined) {
              schema[key].options = value.items.options;
            } else {
              schema[key].options = value.items.enum;
            }
          } else if (value.format !== undefined &&
            (value.format === 'yaml' || value.format === 'javascript')) {
            schema[key].format = value.format;
            schema[key].itemType = 'CodeEditor';
          } else {
            schema[key].itemType = 'Text';
          }
        }
      } else if (value.type === 'object') {
        if (value.properties) {
          schema[key].type = 'Object';
          schema[key].subSchema = this.toFormJSON(value);
        } else {
          schema[key].type = 'CodeEditor';
          schema[key].format = value.format;
        }
      } else if (value.type === 'boolean') {
        schema[key].type = 'Checkbox';
      }
      if (value.format !== undefined) {
        schema[key].validators.push(value.format);
      }
      if (json.required !== undefined &&
        json.required.includes(key)) {
        schema[key].validators.push('required');
      }
    }
    return schema;
  }
  /**
   * Returns local schema for popup with content.
   * @param {Object} schema
   * @returns {Promise}
   */
  toLocalSchema(schema) {
    // Convert dict in schema to array for form generation
    // In json schema, we can't type dict element, so gohan
    // extend json schema using items property for object.
    // If object type has items property, items is considered to
    // schema for object of dict.
    // We will transform schema here for jsonform lib.
    return new Promise((resolve, reject) => {
      const self = this;

      if (Array.isArray(schema.type)) {
        schema.type = schema.type[0];
      }

      if (schema.relation !== undefined) {
        const enumValues = [];
        const options = {};
        const headers = {};

        headers['X-Auth-Token'] = this.collection.userModel.authToken();
        const relatedSchema = this.collection.get(schema.relation);

        fetch(relatedSchema.apiEndpoint(), {headers}).then(
          response => response.json()).then(data => {
            for (let key in data) {
              for (let value of data[key]) {
                enumValues.push(value.id);
                options[value.id] = value.name;
              }
            }
            schema.enum = enumValues;
            schema.options = options;
            resolve(schema);
          }, error => {
            reject(error);
          }
        );
        return;
      }
      const result = Object.assign({}, schema);

      if (schema.type === 'array') {
        const promise = this.toLocalSchema(result.items);

        promise.then(data => {
          result.items = data;
          resolve(result);
        });
        return;
      }

      if (schema.type !== 'object') {
        resolve(schema);
        return;
      }

      if (schema.properties !== undefined) {
        const promises = [];

        for (let key in schema.properties) {
          const promise = self.toLocalSchema(schema.properties[key]);

          promises.push(promise);
          promise.then(function onFulfilled(data) {
            result.properties[key] = data;
          });
        }
        Promise.all(promises).then(() => {
          resolve(result);
        }, data => {
          reject(data);
        });
      } else if (schema.items !== undefined) {
        result.type = 'array';

        this.toLocalSchema(result.items).then(items => {
          if (items.title === undefined) {
            items.title = 'value';
          }
          result.items = {
            type: 'object',
            required: schema.required,
            properties: {
              id: {
                title: 'key',
                type: 'string'
              },
              value: items
            }
          };
          resolve(result);
        }, error => {
          reject(error);
        });
      } else {
        result.type = schema.type;
        result.format = 'yaml';
        result.originalType = 'object';
        resolve(result);
      }
    });
  }

  /**
   * Returns default values in schema.
   * @param {Object} schema
   * @returns {*}
   */
  defaultValue(schema) {
    if (schema.type === 'object') {
      if (schema.default === undefined && schema.properties !== undefined) {
        const result = {};

        for (let key in schema.properties) {
          result[key] = this.defaultValue(schema.properties[key]);
        }
        return result;
      }
    } else if (schema.type === 'array') {
      if (schema.items.properties !== undefined) {
        const result = {};

        for (let key in schema.items.properties) {
          result[key] = this.defaultValue(schema.items.properties[key]);
        }
        return [result];
      }
      return undefined;
    }
    return schema.default;
  }

  /**
   * Format data to local.
   * @param {Object} data
   * @returns {Object}
   */
  toLocal(data) {
    const schema = this.get('schema');
    const defaultValue = this.defaultValue(schema);

    data = defaultValue === undefined ? undefined : Object.assign({}, defaultValue, data);
    return this.toLocalData(schema, data);
  }

  /**
   * Format data to local.
   * @param {Object} schema
   * @param {Object} data
   * @returns {Object}
   */
  toLocalData(schema, data) {
    if (schema.type !== 'object') {
      return data;
    }

    if (data === undefined) {
      return undefined;
    }

    if (schema.format === 'jsonschema') {
      return jsyaml.safeDump(data);
    } else if (schema.properties !== undefined) {
      if (data) {
        for (let key in schema.properties) {
          data[key] = this.toLocalData(schema.properties[key], data[key]);
        }
      }
    } else if (schema.items !== undefined) {
      const result = [];

      if (schema.items.propertiesOrder === undefined) {
        for (let key in data) {
          result.push({
            id: key,
            value: this.toLocalData(schema.items, data[key])
          });
        }
      } else {
        for (let key of schema.items.propertiesOrder) {
          const value = data[key];

          result.push({
            id: key,
            value: this.toLocalData(schema.items, value)
          });
        }
      }
      return result;
    } else {
      return jsyaml.safeDump(data);
    }
    return data;
  }

  /**
   * Format data to server format.
   * @param {Object} data
   * @returns {Object}
   */
  toServer(data) {
    return this.toServerData(this.get('schema'), data);
  }

  /**
   * Format data to server format.
   * @param {Object} schema
   * @param {Object} data
   * @returns {Object}
   */
  toServerData(schema, data) {
    const self = this;

    if (schema.type !== 'object' && schema.originalType !== 'object') {
      return data;
    }

    if (data === undefined) {
      return undefined;
    }

    if (schema.properties !== undefined) {
      const result = {};
      for (let key in schema.properties) {
        if (key === 'id') {
          continue;
        }
        result[key] = self.toServerData(schema.properties[key], data[key]);
      }
      return result;
    } else if (schema.items !== undefined) {
      const result = {};

      for (let d of data) {
        result[d.id] = self.toServerData(schema.items, d.value);
      }
      return result;
    }
    return jsyaml.safeLoad(data);
  }

  /**
   * Filters schema by action.
   * @param {string} action
   * @param {string} [parentProperty]
   * @returns {Promise}
   */
  filterByAction(action, parentProperty) {
    return new Promise((resolve, reject) => {
      let result = {};
      const schema = this.toJSON();

      this.toLocalSchema(schema.schema).then(localSchema => {
        for (let key in localSchema.properties) {
          const property = localSchema.properties[key];

          if (key === 'id' && property.format === 'uuid') {
            continue;
          }

          if (key === parentProperty) {
            continue;
          }

          if (property.permission === null ||
            property.permission === undefined) {
            continue;
          }

          const view = property.view;

          if (view) {
            if (view.indexOf(action) < 0) {
              continue;
            }
          }

          if (property.permission.indexOf(action) >= 0) {
            result[key] = property;
          }
        }
        let required = [];

        if (schema.schema.required) {
          required = schema.schema.required.filter(property => {
            return result.hasOwnProperty(property);
          });
        }

        result = {
          type: 'object',
          properties: result,
          propertiesOrder: schema.schema.propertiesOrder,
          required
        };

        resolve(result);
      }, error => {
        reject(error);
        console.error(error);
      });
    });
  }

  /**
   * Returns children of schema.
   * @returns {TModel[]}
   */
  children() {
    return this.collection.filter(schema => {
      return schema.get('parent') === this.id;
    });
  }
}
