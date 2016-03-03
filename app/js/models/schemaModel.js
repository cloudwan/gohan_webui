var jsyaml = require('js-yaml');
var Promise = require('promise');

var SchemaModel = Backbone.Model.extend({
  collections: [],
  apiEndpoint: function apiEndpoint() {
    return this.apiEndpointBase() + this.get('url');
  },
  apiEndpointBase: function apiEndpointBase() {
    return this.collection.baseUrl;
  },
  detailPath: function detailPath(id) {
    return this.get('prefix') + '/' + id;
  },
  url: function url() {
    if (!this.hasParent()) {
      return this.get('url');
    }

    var parentSchema = this.parent();

    return parentSchema.url() + '/:' + parentSchema.get('singular') + '/' + this.get('plural');
  },
  parent: function parent() {
    var parentId = this.get('parent');

    return this.collection.get(parentId);
  },
  parentProperty: function parentProperty() {
    return this.get('parent') + '_id';
  },
  hasParent: function hasParent() {
    return !_.isUndefined(this.get('parent')) && this.get('parent') != '';
  },
  makeModel: function makeModel(baseUrl) {
    var self = this;
    var userModel = self.collection.userModel;

    if (_.isUndefined(baseUrl)) {
      baseUrl = self.apiEndpoint();
    }

    return Backbone.Model.extend({
      schema: self,
      initialize: function initialize() {
        this.baseUrl = baseUrl;
        this.url = this.baseUrl;
      },
      isNew: function isNew() {
        return this.get('isNew');
      },
      parse: function parse(resp) {
        if (_.isUndefined(resp.id)) {
           return resp[self.get('singular')];
        }
        return resp;
      },
      sync: function sync(method, model, options) {
        if (!this.isNew()) {
            this.url = this.baseUrl + '/' + this.id;
        }

        if (method === 'patch') {
          method = 'update';
        }

        if (_.isUndefined(options)) {
          options = {};
        }
        options.headers = {
          'X-Auth-Token': userModel.authToken(),
          'Content-Type':'application/json'
        };
        this.unset('isNew');

        var data = {};
        var cloneOfModel = model.clone();
        var modelJSON = {};

        self.filterByAction(method).then(function onFulfilled(schemaForAction) {
          _.each(schemaForAction.properties, function iterator(value, key) {
            modelJSON[key] = cloneOfModel.get(key);
          });

          data[this.schema.get('singular')] = modelJSON;
          options.data = JSON.stringify(data);
          Backbone.sync(method, model, options);
        }.bind(this));
      },
      parentId: function parentId() {
        if (this.schema.hasParent()) {
          var parentProperty = this.schema.parentProperty();

          return this.get(parentProperty);
        }
        return undefined;
      },
      fragment: function fragment() {
        var path = this.schema.detailPath(this.id);

        return path.substr(1);
      },
      getAncestors: function getAncestors(callback, ancestors) {
        var self = this;

        if (_.isUndefined(ancestors)) {
          ancestors = [];
        }

        if (!self.schema.hasParent()) {
          callback(ancestors);
          return;
        }

        var parentSchema = self.schema.parent();
        var parentModelClass = parentSchema.makeModel();

        if (_.isUndefined(self.parentId())) {
          return;
        }

        var parentModel = new parentModelClass({id: self.parentId()});

        parentModel.fetch({
          success: function success() {
            ancestors.push(parentModel);
            parentModel.getAncestors(callback, ancestors);
          }});
      }
    });
  },
  makeCollection: function makeCollection(url) {
    var self = this;

    if (_.isUndefined(url)) {
      url = self.apiEndpoint();
    }

    if (self.collections[url]) {
      return self.collections[url];
    }

    var model = self.makeModel(url);
    var userModel = self.collection.userModel;
    var additionalForms = self.collection.additionalForms;

    if (!_.isUndefined(additionalForms) && !_.isUndefined(additionalForms[self.id])) {
      self.additionalForm = additionalForms[self.id];
    } else {
      self.additionalForm = ['*'];
    }

    var collectionClass = Backbone.Collection.extend({
      url: url,
      model: model,
      schema: self,
      longPolling: false,
      timeOutId: -1,
      intervalSeconds: 10,
      parse: function parse(resp) {
        return resp[self.get('plural')];
      },
      unsetAuthData: function unsetAuthData() {
        this.userModel.unsetAuthData();
      },
      startLongPolling: function startLongPolling(intervalSeconds) {
        this.longPolling = true;

        if (intervalSeconds) {
          this.intervalSeconds = intervalSeconds;
        }
        this.executeLongPolling();
      },
      stopLongPolling: function stopLongPolling() {
        this.longPolling = false;
        clearTimeout(this.timeOutId);
        this.timeOutId = -1;
      },
      executeLongPolling: function executeLongPulling() {
        var fetchSuccess = function fetchSuccess() {
          if (this.longPolling) {
            this.timeOutId = setTimeout(this.executeLongPolling.bind(this), 1000 * this.intervalSeconds);
          }
        };

        this.fetch({success: fetchSuccess.bind(this)});
      },
      sync: function sync(method, collection, options) {
        if (_.isUndefined(options)) {
          options = {};
        }
        options.headers = {
          'X-Auth-Token': userModel.authToken(),
          'Content-Type':'application/json'
        };
        Backbone.sync(method, collection, options);
      }
    });
    var collection = new collectionClass({});

    self.collections[url] = collection;
    return collection;
  },
  /**
   * Returns local schema for popup with content.
   * @param {Object} schema
   * @returns {Promise}
   */
  toLocalSchema: function toLocalSchema(schema) {
    // Convert dict in schema to array for form generation
    // In json schema, we can't type dict element, so gohan
    // extend json schema using items property for object.
    // If object type has items property, items is considered to
    // schema for object of dict.
    // We will transform schema here for jsonform lib.
    return new Promise(function promise(resolve, reject) {
      var self = this;

      if (_.isArray(schema.type)) {
        schema.type = schema.type[0];
      }

      if (!_.isUndefined(schema.relation)) {
        var enumValues = [];
        var options = {};
        var headers = {};

        headers['X-Auth-Token'] = self.collection.userModel.authToken();
        var relatedSchema = self.collection.get(schema.relation);

        $.ajax({
          url: relatedSchema.apiEndpoint(),
          headers: headers
        }).then(function success(data) {
          _.each(data, function iterator(values) {
            _.each(values, function iterator(value) {
              enumValues.push(value.id);
              options[value.id] = value.name;
            });
          });

          schema.enum = enumValues;
          schema.options = options;
          resolve(schema);
        }, function error(error) {
          reject(error);
        });
        return;
      }
      var result = $.extend(true, {}, schema);

      if (schema.type == 'array') {
        var promise = self.toLocalSchema(result.items);

        promise.then(function onFulfilled(data) {
          result.items = data;
          resolve(result);
        });
        return;
      }

      if (schema.type != 'object') {
        resolve(schema);
        return;
      }

      if (!_.isUndefined(schema.properties)) {
        var promises = [];

        $.each(schema.properties, function iterator(key, property) {
          var promise = self.toLocalSchema(property);

          promises.push(promise);
          promise.then(function onFulfilled(data) {
            result.properties[key] = data;
          });
        });
        Promise.all(promises).then(function onFulfilled() {
          resolve(result);
        }, function onRejected(data) {
          reject(data);
        });
      } else if (!_.isUndefined(schema.items)) {
        result.type = 'array';
        var items = self.toLocalSchema(result.items);

        if (_.isUndefined(items.title)) {
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
      } else {
        result.type = 'string';
        result.format = 'yaml';
        resolve(result);
      }
    }.bind(this));
  },
  defaultValue: function defaultValue(schema) {
    var self = this;

    if (schema.type == 'object') {
      if (_.isUndefined(schema.default)) {
        var result = {};

        _.each(schema.properties, function iterator(property, key) {
          result[key] = self.defaultValue(property);
        });
        return result;
      }
    }
    return schema.default;
  },
  toLocal: function toLocal(data) {
    var schema = this.get('schema');

    data = _.extend(this.defaultValue(schema), data);
    return this.toLocalData(schema, data);
  },
  toLocalData: function toLocalData(schema, data) {
    var self = this;

    if (schema.type != 'object') {
      return data;
    }

    if (_.isUndefined(data)) {
      return undefined;
    }

    if (schema.format == 'jsonschema') {
      return jsyaml.safeDump(data);
    } else if (!_.isUndefined(schema.properties)) {
      $.each(schema.properties, function iterator(key, property) {
        data[key] = self.toLocalData(property, data[key]);
      });
    } else if (!_.isUndefined(schema.items)) {
      var result = [];

      if (_.isUndefined(schema.items.propertiesOrder)) {
        _.each(data, function iterator(value, key) {
          result.push({
            id: key,
            value: self.toLocalData(schema.items, value)
          });
        });
      } else {
        _.each(schema.items.propertiesOrder, function iterator(key) {
          var value = data[key];

          result.push({
            id: key,
            value: self.toLocalData(schema.items, value)
          });
        });
      }
      return result;
    } else {
      return jsyaml.safeDump(data);
    }
    return data;
  },
  toServer: function toServer(data) {
    return this.toServerData(this.get('schema'), data);
  },
  toServerData: function toServerData(schema, data) {
    var self = this;

    if (schema.type != 'object') {
      return data;
    }

    if (_.isUndefined(data)) {
      return undefined;
    }

    if (!_.isUndefined(schema.properties)) {
      $.each(schema.properties, function iterator(key, property) {
        data[key] = self.toServerData(property, data[key]);
      });
    } else if (!_.isUndefined(schema.items)) {
      var result = {};

      _.each(data, function iterator(d) {
        result[d.id] = self.toServerData(schema.items, d.value);
      });
      return result;
    } else {
      return jsyaml.safeLoad(data);
    }
    return data;
  },
  /**
   * Returns filtered schema by action.
   * @param {string} action
   * @param {string} parentProperty
   * @returns {Promise}
   */
  filterByAction: function filterByAction(action, parentProperty) {
    return new Promise(function promise(resolve) {
      var result = {};
      var schema = this.toJSON();

      this.toLocalSchema(schema.schema).then(function onFulfilled(localSchema) {
        $.each(localSchema.properties, function iterator(key, property) {
          if (key == 'id' && property.format == 'uuid') {
            return;
          }

          if (key == parentProperty) {
            return;
          }

          if (_.isNull(property.permission) || _.isUndefined(property.permission)) {
            return;
          }

          var view = property.view;

          if (view) {
            if (view.indexOf(action) < 0) {
              return;
            }
          }

          if (property.permission.indexOf(action) >= 0) {
            result[key] = property;
          }
        });

        var required = _.filter(schema.schema.required, function iterator(property) {
          return result.hasOwnProperty(property);
        });

        result = {
          type: 'object',
          properties: result,
          propertiesOrder: schema.schema.propertiesOrder,
          required: required
        };

        resolve(result);
      }, function onRejected(error) {
        console.error(error);
      });
    }.bind(this));
  },
  children: function children() {
    var self = this;

    return this.collection.filter(function iterator(schema) {
      return schema.get('parent') === self.id;
    });
  }
});

module.exports = SchemaModel;
