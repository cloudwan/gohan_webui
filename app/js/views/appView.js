var template = require('./../../templates/app.html');
var UserModel = require('./../models/userModel');
var SchemaCollection = require('./../models/schemaCollection');
var SidebarView = require('./sidebarView');
var HeaderView = require('./headerView');
var TableView = require('./tableView');
var DetailView = require('./detailView');
var LoginView = require('./loginView');
var SampleView = require('./sampleView');
var ErrorView = require('./errorView');
var BreadCrumbView = require('./breadCrumbView');

var AppView = Backbone.View.extend({
  mainView: null,
  className: 'appview',
  initialize: function initialize(options) {
    var self = this;

    self.errorView = new ErrorView();
    self.router = options.router;

    var config = options.config;

    self.config = config;
    self.viewClass = _.extend({
      table: TableView,
      detail: DetailView,
      sampleview: SampleView
    }, options.viewClass);

    if (config.authUrl.indexOf('__HOST__') > 0) {
      config.authUrl = config.authUrl.replace(
        '__HOST__', window.location.hostname);
    }

    if (config.gohan.url.indexOf('__HOST__') > 0) {
      config.gohan.url = config.gohan.url.replace(
        '__HOST__', window.location.hostname);
    }

    self.userModel = options.userModel;

    if (_.isUndefined(self.userModel)) {
      self.userModel = new UserModel({
        url: self.config.authUrl + '/tokens'
      });
    }
    self.view = null;
    self.buildView();

    self.schemas = options.scheams;

    if (_.isUndefined(self.schemas)) {
      self.schemas = new SchemaCollection({
        baseUrl: self.config.gohan.url,
        userModel: self.userModel,
        url: self.config.gohan.url + self.config.gohan.schema,
        additionalForms: self.config.additionalForms
      });
    }

    self.listenTo(self.schemas, 'update', self.autoBuildUI);

    if (self.userModel.authToken()) {
      self.schemas.fetch({
        error: self.errorView.render
      });
    } else {
      self.listenTo(self.userModel, 'change:auth_data', function onChangeAuthData() {
        self.$('#main_body').empty();
        self.schemas.fetch();
        self.render();
      });
    }
  },
  buildView: function buildView() {
    this.sidebarView = new SidebarView({
      collection: new Backbone.Collection()
    });
    this.headerView = new HeaderView({
      config: this.config,
      model: this.userModel
    });
    this.breadCrumb = new BreadCrumbView();
  },
  getParamFromQuery: function　getParamFromQuery()　{
    var params = {};
    var queryStrings = document.location.search.substr(1);

    if ( queryStrings === '') {
        return params;
    }
    _.each(
      queryStrings.split('&'),
      function parseEqual(query) {
        var i = query.split('=');

        params[i[0].toString()] = i[1].toString();
    });
    return params;
  },
  autoBuildUIForSchema: function autoBuildUIForSchema(schema) {
    var self = this;
    var viewClass = {};

    var metadata = schema.get('metadata');
    var params = self.getParamFromQuery();
    var type = params.type || 'tenant';

    if (metadata && metadata.type != type) {
        return;
    }

    _.extend(viewClass, self.viewClass, self.viewClass[schema.id]);
    var collection = schema.makeCollection();

    if (schema.hasParent()) {
      var fullRoute = schema.url();

      fullRoute = fullRoute.substr(1);

      var childTableView = function childTableView() {
        $('#alerts').empty();
        var endpoint = schema.apiEndpointBase() + '/' + Backbone.history.fragment;
        var collection = schema.makeCollection(endpoint);

        self.view && (self.view.close ? self.view.close() : self.view.remove());
        self.view = new viewClass.table({
          schema: schema,
          collection: collection,
          childview: true,
          fragment: Backbone.history.fragment,
          app: self
        });

        self.$('#main_body').html(self.view.render().el);
        self.$('#main').addClass('active');
      };

      var childDetailView = function childDetailView() {
        $('#alerts').empty();
        var id = arguments[arguments.length - 2];
        var model = collection.get(id);

        if (_.isUndefined(model)) {
          model = new collection.model({id: id});
        }

        self.view && (self.view.close ? self.view.close() : self.view.remove());
        self.view = new viewClass.detail({
          schema: schema,
          model: model,
          childview: true,
          fragment: Backbone.history.fragment,
          app: self
        });

        self.$('#main_body').html(self.view.render().el);
        self.$('#main').addClass('active');
      };

      self.router.route(fullRoute, 'child_table_view', childTableView);
      self.router.route(fullRoute + '/:id', 'detail_view', childDetailView);
    } else {
      var route = schema.get('url');
      var path = '#' + route;

      route = route.substr(1);
      var sidebarMenu = {};

      if (this.config.sidebar) {
        self.sidebarView.collection.comparator = 'order';
        _.each(this.config.sidebar, function iterator(value, key) {
          if (value.path === path) {
            sidebarMenu = self.sidebarView.collection.add({
              path: path,
              title: value.title,
              order: key
            });
          }
        });
      } else {
        sidebarMenu = self.sidebarView.collection.push({
          path: path,
          title: schema.get('title')
        });
      }

      if (!_.isUndefined(this.config.routes)
        && _.contains(_.pluck(self.config.routes, 'path'), route)) {
        _.each(this.config.routes, function iterator(value) {
          if (value.path === route) {
            var customView = function customView(data) {
              self.view && (self.view.close ? self.view.close() : self.view.remove());
              self.view = new viewClass[value.viewClass]({
                arguments: arguments,
                schema: schema,
                collection: collection,
                fragment: Backbone.history.fragment,
                app: self,
                data: data
              });

              self.$('#main_body').html(self.view.render().el);
              self.$('#main').addClass('active');
              self.sidebarView.select(sidebarMenu);
            };

            self.router.route(value.path, value.name, customView);
          }
        });
      } else {
        var tableView = function tableView(page) {
          $('#alerts').empty();
          self.view && (self.view.close ? self.view.close() : self.view.remove());
          self.view = new viewClass.table({
            schema: schema,
            collection: collection,
            fragment: Backbone.history.fragment,
            app: self,
            page: page
          });

          self.$('#main_body').html(self.view.render().el);
          self.$('#main').addClass('active');
          self.sidebarView.select(sidebarMenu);
        };

        var detailView = function detailView(id) {
          $('#alerts').empty();
          var model = collection.get(id);

          if (_.isUndefined(model)) {
            model = new collection.model({id: id});
          }

          self.view && (self.view.close ? self.view.close() : self.view.remove());
          self.view = new viewClass.detail({
            schema: schema,
            model: model,
            fragment: Backbone.history.fragment,
            app: self
          });

          self.$('#main_body').html(self.view.render().el);
          self.$('#main').addClass('active');
          self.sidebarView.select(sidebarMenu);
        };

        self.router.route(route, 'table_view', tableView);
        self.router.route(route + '/page/:id', 'table_view', tableView);
        self.router.route(route + '/:id', 'detail_view', detailView);
      }
    }
  },
  buildCustomUI: function buildCustomUI() {
    var self = this;

    _.each(this.config.sidebar, function iterator(route, key) {
      if (!_.contains(_.pluck(self.sidebarView.collection.toJSON(), 'path'), route.path)) {
        var sidebarMenu = self.sidebarView.collection.add({
          path: route.path,
          title: route.title,
          order: key
        });

        var customView = function customView(data) {
          self.view && (self.view.close ? self.view.close() : self.view.remove());
          self.view = new self.viewClass[route.viewClass]({
            arguments: arguments,
            fragment: Backbone.history.fragment,
            app: self,
            data: data
          });

          self.$('#main_body').html(self.view.render().el);
          self.$('#main').addClass('active');
          self.sidebarView.select(sidebarMenu);
        };

        self.router.route(route.path.substr(2), route.name, customView);
      }
    });

    _.each(this.config.routes, function iterator(routes) {
      if (!self.router.pathIsRegistered(routes.path)) {
        var customView = function customView(data) {
          self.view && (self.view.close ? self.view.close() : self.view.remove());
          self.view = new self.viewClass[routes.viewClass]({
            arguments: arguments,
            fragment: Backbone.history.fragment,
            app: self,
            data: data
          });

          self.$('#main_body').html(self.view.render().el);
          self.$('#main').addClass('active');
        };

        self.router.route(routes.path, routes.name, customView);
      }
    });
  },
  autoBuildUI: function autoBuildUI() {
    var self = this;

    self.schemas.each(function iterator(schema) {
      self.autoBuildUIForSchema(schema);
    });
    self.buildCustomUI();
    Backbone.history.loadUrl(Backbone.history.fragment);
  },
  login: function login() {
    var loginView = new LoginView({
      model: this.userModel
    });

    this.$el.html(loginView.render().el);
  },
  render: function render() {
    if (!this.userModel.authToken()) {
      this.login();
    } else {
      this.$el.html(template());
      this.$('#header').append(this.headerView.render().el);
      this.$('#sidebar').append(this.sidebarView.render().el);
      this.$('#bread-crumb').append(this.breadCrumb.render().el);
    }
    return this;
  }
});

module.exports = AppView;
