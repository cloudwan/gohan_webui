var Router = Backbone.Router.extend({
  routes: [],
  route: function route(route, name) {
    this.routes.push({
      path: route,
      name: name
    });

    Backbone.Router.prototype.route.apply(this, arguments);
  },
  pathIsRegistered: function pathIsRegistered(path) {
    return _.contains(_.pluck(this.routes, 'path'), path);
  }
});

module.exports = Router;
