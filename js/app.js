require('bootstrap');
require('bootstrap-material-design');
require('bootstrap-dialog');

var AppView = require('./views/appView');
var SchemaView = require('./views/schemaView');

(function() {
  var app = {
    error: function(collection, response) {
      var message = 'Unknown Error';
      message = response.statusText;
      switch (response.status) {
        case 0:
          message = 'Server Connection failed';
          collection.unsetAuthData();
          break;
        case 400:
          message = 'Invalid input error:' + response.responseJSON.error.message;
          break;
        case 401:
          message = 'Unauthorized Error: please retry login';
          collection.unsetAuthData();
          break;
        case 404:
          message = 'Data Not Found';
          break;
        case 500:
          message = 'Server Side Error';
          break;
      }
      var html = JST['error.html']({
        message: message
      });
      if ($('#alerts_form').length > 0) {
        $('#alerts_form').html(html);
      } else {
        $('#alerts').html(html);
      }
    }
  };
  if (!window.Gohan) window.Gohan = {};
  _.extend(Gohan, app);
})();



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
