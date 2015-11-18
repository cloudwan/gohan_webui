require('bootstrap');
require('bootstrap-material-design');
require('bootstrap-dialog');

var AppView = require('./views/appView');
var SchemaView = require('./views/schemaView');

//Set up
(function strict() {
  $.material.init();
  $.get('config.json').then(
    function onSuccess(config) {
      var router = new Backbone.Router;
      var rootView = new AppView({
        router: router,
        config: config,
        viewClass: {
          schema: {
          table: SchemaView
        }}
      });

      $('body').append(rootView.render().el);
      Backbone.history.start();
    }).fail(function onFail() {
    $('body').append('Failed to load config.json');
  });
})();
