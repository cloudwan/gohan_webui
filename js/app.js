require('bootstrap');
require('bootstrap-material-design');
require('bootstrap-dialog');

var AppView = require('./views/appView');
var SchemaView = require('./views/schemaView');

//Set up
(function() {
  $.material.init();
  $.get('config.json').then(
    function(config) {
      var router = new Backbone.Router;
      var root_view = new AppView({
        router: router,
        config: config,
        viewClass: {'schema': {
          table: SchemaView
        }}
      });
      $('body').append(root_view.render().el);
      Backbone.history.start();
    }).fail(function() {
    $('body').append('Failed to load config.json');
  });
})();
