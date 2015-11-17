var jsyaml = require('js-yaml');

var SchemaModel = Backbone.Model.extend({
  collections: [],
  apiEndpoint: function(){
    return this.apiEndpointBase() + this.get('url');
  },
  apiEndpointBase: function() {
    return this.collection.base_url;
  },
  detailPath: function(id){
    return this.get('url') + '/' + id;
  },
  url: function() {
    if(!this.hasParent()){
      return this.get('url');
    }
    var parent_schema = this.parent();
    return parent_schema.url() + '/:' + parent_schema.get('singular') + '/' + this.get('plural');
  },
  parent: function(){
    var parent_id = this.get('parent');
    return this.collection.get(parent_id);
  },
  parentProperty: function(){
    return this.get('parent') + '_id';
  },
  hasParent: function(){
    return !_.isUndefined(this.get('parent')) && this.get('parent') != '';
  },
  makeModel: function(base_url) {
    var self = this;
    if(_.isUndefined(base_url)){
      base_url = self.apiEndpoint();
    }
    var userModel = self.collection.userModel;
    return Backbone.Model.extend({
      schema: self,
      initialize: function() {
        this.base_url = base_url;
        this.url = this.base_url;
      },
      isNew: function() {
        return this.get('_is_new');
      },
      parse: function(resp) {
        if(_.isUndefined(resp['id'])){
           return resp[self.get('singular')];
        }
        return resp;
      },
      sync: function(method, model, options){
        if (!this.isNew()) {
            this.url = this.base_url + '/' + this.id;
        }
        if(method === 'patch'){
          method = 'update';
        }
        if(_.isUndefined(options)){
          options = {};
        }
        options['headers'] = {
          'X-Auth-Token': userModel.authToken(),
          'Content-Type':'application/json'
        };
        this.unset('_is_new');
        var data = {};
        var modelJSON= {}
        var schemaForAction = self.filterByAction(method)
        console.log(schemaForAction)
        _.each(schemaForAction.properties, function(value, key){
          modelJSON[key] = model.get(key)
        })
        console.log(modelJSON)
        data[this.schema.get('singular')] = modelJSON
        options.data = JSON.stringify(data);
        Backbone.sync(method, model, options);
      },
      parent_id: function(){
        if(this.schema.hasParent()){
          var parent_property = this.schema.parentProperty();
          return this.get(parent_property);
        }
        return undefined;
      },
      fragment: function() {
        var path = this.schema.detailPath(this.id);
        return path.substr(1);
      },
      getAncestors: function(callback, ancestors) {
        var self = this;
        if(_.isUndefined(ancestors)){
          ancestors = [];
        }
        if(!self.schema.hasParent()){
          callback(ancestors);
          return;
        }
        var parent_schema = self.schema.parent();
        var parent_model_class = parent_schema.makeModel();
        if(_.isUndefined(self.parent_id())){
          return;
        }
        var parent_model = new parent_model_class({'id': self.parent_id()});
        parent_model.fetch({
          success: function(){
            ancestors.push(parent_model);
            parent_model.getAncestors(callback, ancestors);
          }});
      }
    });
  },
  makeCollection: function(url) {
    var self = this;
    if(_.isUndefined(url)){
      url = self.apiEndpoint();
    }
    if(self.collections[url]){
      return self.collections[url];
    }
    var model = self.makeModel(url);
    var userModel = self.collection.userModel;
    var additionalForms = self.collection.additionalForms;
    self.additionalForm = additionalForms[self.id] || ['*'];
    var collection_class = Backbone.Collection.extend({
      url: url,
      model: model,
      schema: self,
      parse: function(resp) {
        return resp[self.get('plural')];
      },
      unsetAuthData: function() {
        this.userModel.unsetAuthData();
      },
      sync: function(method, collection, options){
        if(_.isUndefined(options)){
          options = {};
        }
        options['headers'] = {
          'X-Auth-Token': userModel.authToken(),
          'Content-Type':'application/json'
        };
        Backbone.sync(method, collection, options);
      }
    });
    var collection = new collection_class({});
    self.collections[url] = collection;
    return collection;
  },
  toLocalSchema: function(schema) {
    //convert dict in schema to array for form generation
    //In json schema, we can't type dict element, so gohan
    //extend json schema using items property for object.
    //If object type has items property, items is considered to
    //schema for object of dict.
    //We will transform schema here for jsonform lib.
    var self = this;
    if (_.isArray(schema.type)) {
      schema.type = schema.type[0];
    }
    if (!_.isUndefined(schema.relation)) {
      var enum_values = [];
      var options = {};
      var headers = {};
      headers['X-Auth-Token'] = self.collection.userModel.authToken();
      var relatedSchema = self.collection.get(schema.relation);
      $.ajax({
        url: relatedSchema.apiEndpoint(),
        headers: headers,
        //need revisit
        async: false,
      }).then(function(data) {
        _.each(data, function(values, key) {
          _.each(values, function(value) {
            enum_values.push(value.id);
            options[value.id] = value.name;
          });
        });
      });
      schema.enum = enum_values;
      schema.options = options;
      return schema;
    }
    var result = $.extend(true, {}, schema);
    if (schema.type == 'array') {
      result.items = self.toLocalSchema(result.items);
      return result;
    };
    if (schema.type != 'object') {
      return schema;
    }
    if (!_.isUndefined(schema.properties)) {
      $.each(schema.properties, function(key, property) {
        result.properties[key] = self.toLocalSchema(property);
      });
    } else if (!_.isUndefined(schema.items)) {
      result.type = 'array';
      var items = self.toLocalSchema(result.items);
      if (_.isUndefined(items.title)) {
        items.title = 'value';
      }
      result.items = {
        'type': 'object',
        'required': schema.required,
        'properties': {
          'id': {
            'title': 'key',
            'type': 'string'
          },
          'value': items
        }
      };
    } else {
      result.type = 'string';
      result.format = 'yaml';
    }
    return result;
  },
  defaultValue: function(schema) {
    var self = this;
    if (schema.type == 'object') {
      if (_.isUndefined(schema.default)) {
        var result = {};
        _.each(schema.properties, function(property, key) {
          result[key] = self.defaultValue(property);
        });
        return result;
      }
    }
    return schema.default;
  },
  toLocal: function(data) {
    var default_value = {};
    var schema = this.get('schema');
    data = _.extend(this.defaultValue(schema), data);
    return this.toLocalData(schema, data);
  },
  toLocalData: function(schema, data) {
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
      $.each(schema.properties, function(key, property) {
        data[key] = self.toLocalData(property, data[key]);
      });
    } else if (!_.isUndefined(schema.items)) {
      var result = [];
      if (_.isUndefined(schema.items.propertiesOrder)) {
        _.each(data, function(value, key) {
          result.push({
            'id': key,
            'value': self.toLocalData(schema.items, value)
          });
        });
      } else {
        _.each(schema.items.propertiesOrder, function(key) {
          var value = data[key];
          result.push({
            'id': key,
            'value': self.toLocalData(schema.items, value)
          });
        });
      }
      return result;
    } else {
      return jsyaml.safeDump(data);
    }
    return data;
  },
  toServer: function(data) {
    return this.toServerData(this.get('schema'), data);
  },
  toServerData: function(schema, data) {
    var self = this;
    if (schema.type != 'object') {
      return data;
    }
    if (_.isUndefined(data)) {
      return undefined;
    }
    if (!_.isUndefined(schema.properties)) {
      $.each(schema.properties, function(key, property) {
        data[key] = self.toServerData(property, data[key]);
      });
    } else if (!_.isUndefined(schema.items)) {
      var result = {};
      _.each(data, function(d) {
        result[d.id] = self.toServerData(schema.items, d.value);
      });
      return result;
    } else {
      return jsyaml.safeLoad(data);
    }
    return data;
  },
  filterByAction: function(action, parent_property) {
    var result = {};
    var schema = this.toJSON();
    var local_schema = this.toLocalSchema(schema.schema);
    $.each(local_schema.properties, function(key, property) {
      if (key == 'id' && property.format == 'uuid') {
        return;
      }
      if (key == parent_property) {
        return;
      }
      if (_.isNull(property.permission) || _.isUndefined(property.permission)) {
        return;
      }
      var view = property['view']
      if(view){
        if(view.indexOf(action) < 0){
          return
        }
      }
      if (property.permission.indexOf(action) >= 0) {
        result[key] = property;
      }
    });
    var required = _.filter(schema.schema.required, function(property) {
      return result.hasOwnProperty(property);
    });
    return {
      'type': 'object',
      'properties': result,
      'propertiesOrder': schema.schema.propertiesOrder,
      'required': required
    };
  },
  children: function() {
    var self = this;
    return this.collection.filter(function (schema) {
      return schema.get('parent') === self.id;
    });
  }
});

module.exports = SchemaModel;
