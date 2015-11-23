
var SchemaModel = require('./schemaModel');

var SchemaCollection = Backbone.Collection.extend({
  model: SchemaModel,
  initialize: function initialize(options) {
      this.baseUrl = options.baseUrl;
      this.url = options.url;
      this.userModel = options.userModel;
      this.additionalForms = options.additionalForms;
  },
  parse: function parse(resp) {
    return resp.schemas;
  },
  unsetAuthData: function unsetAuthData() {
    this.userModel.unsetAuthData();
  },
  sync: function sync(method, collection, options) {
    if (_.isUndefined(options)) {
      options = {};
    }

    options.headers = {
      'X-Auth-Token': this.userModel.authToken(),
      'Content-Type': 'application/json'
    };
    Backbone.sync(method, collection, options);
  }
});

module.exports = SchemaCollection;
