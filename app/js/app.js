require('bootstrap');
require('bootstrap-dialog');
require('../css/sass/dashboard.scss');

var AppView = require('./views/appView');
var SchemaView = require('./views/schemaView');
var Router = require('./routers/router');

//Set up
(function strict() {
  $.get('config.json').then(
    function onSuccess(config) {
      var router = new Router();
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
