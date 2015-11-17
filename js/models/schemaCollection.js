
var SchemaModel = require('./schemaModel');

var SchemaCollection = Backbone.Collection.extend({
  model: SchemaModel,
    initialize: function(options) {
      this.base_url = options.base_url;
      this.url = options.url;
      this.userModel = options.userModel;
      this.additionalForms = options.additionalForms;
  },
  parse: function(resp) {
    return resp['schemas'];
  },
  unsetAuthData: function() {
    this.userModel.unsetAuthData();
  },
  sync: function(method, collection, options){
    if(_.isUndefined(options)){
      options = {};
    }
    options['headers'] = {
      'X-Auth-Token': this.userModel.authToken(),
      'Content-Type':'application/json'
    };
    Backbone.sync(method, collection, options);
  }
});

module.exports = SchemaCollection;
