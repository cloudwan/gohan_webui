//Set up
$(function() {
  $.material.init();
  $.get('config.json').then(
    function(config) {
      var router = new Backbone.Router;
      var root_view = new Gohan.AppView({
        router: router,
        config: config,
        viewClass: {'schema': {
          table: Gohan.SchemaView
        }}
      });
      $('body').append(root_view.render().el);
      Backbone.history.start();
    }).fail(function() {
    $('body').append('Failed to load config.json');
  });
});
