var templates = require('./../../jst/templates');
var UserModel = require('./../models/userModel');
var SchemaCollection = require('./../models/schemaCollection');
var SidebarView = require('./sidebarView');
var HeaderView = require('./headerView');
var TableView = require('./tableView');
var DetailView = require('./detailView');
var LoginView = require('./loginView');
var ErrorView = require('./errorView');

var AppView = Backbone.View.extend({
  mainView: null,
  className: 'appview',
  initialize: function initialize(options) {
    var self = this;

    self.errorView = new ErrorView();
    self.router = options.router;

    var config = options.config;

    self.config = config;
    self.viewClass = options.viewClass || {};

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
  },
  autoBuildUIForSchema: function autoBuildUIForSchema(schema) {
    var self = this;
    var viewClass = {
      table: TableView,
      detail: DetailView
    };

    _.extend(viewClass, self.viewClass[schema.id]);
    var collection = schema.makeCollection();

    if (schema.hasParent()) {
      var fullRoute = schema.prefix();

      fullRoute = fullRoute.substr(1);

      var childTableView = function childTableView() {
        $('#alerts').empty();
        var endpoint = schema.apiEndpointBase() + '/' + Backbone.history.fragment;
        var collection = schema.makeCollection(endpoint);
        var tableView = new viewClass.table({
          schema: schema,
          collection: collection,
          childview: true,
          fragment: Backbone.history.fragment,
          app: self
        });

        self.$('#main_body').html(tableView.render().el);
        self.$('#main').addClass('active');
      };

      var childDetailView = function childDetailView() {
        $('#alerts').empty();
        var id = arguments[arguments.length - 2];
        var model = collection.get(id);

        if (_.isUndefined(model)) {
          model = new collection.model({id: id});
        }
        var detailView = new viewClass.detail({
          schema: schema,
          model: model,
          childview: true,
          fragment: Backbone.history.fragment,
          app: self
        });

        self.$('#main_body').html(detailView.render().el);
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
        _.each(this.config.sidebar, function iterator(value) {
          if (value.path === path) {
            sidebarMenu = self.sidebarView.collection.push({
              path: path,
              title: value.title
            });
          }
        });
      } else {
        sidebarMenu = self.sidebarView.collection.push({
          path: '#' + route,
          title: schema.get('title')
        });
      }

      var tableView = function tableView() {
        $('#alerts').empty();
        var tableView = new viewClass.table({
          schema: schema,
          collection: collection,
          fragment: Backbone.history.fragment,
          app: self
        });

        self.$('#main_body').html(tableView.render().el);
        self.$('#main').addClass('active');
        self.sidebarView.select(sidebarMenu);
      };

      var detailView = function detailView(id) {
        $('#alerts').empty();
        var model = collection.get(id);

        if (_.isUndefined(model)) {
          model = new collection.model({id: id});
        }

        var detailView = new viewClass.detail({
          schema: schema,
          model: model,
          fragment: Backbone.history.fragment,
          app: self
        });

        self.$('#main_body').html(detailView.render().el);
        self.$('#main').addClass('active');
        self.sidebarView.select(sidebarMenu);
      };

      self.router.route(route, 'table_view', tableView);
      self.router.route(route + '/:id', 'detail_view', detailView);
    }
  },
  autoBuildUI: function autoBuildUI() {
    var self = this;

    self.schemas.each(function iterator(schema) {
      self.autoBuildUIForSchema(schema);
    });
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
      this.$el.html(templates.app());
      this.$('#header').append(this.headerView.render().el);
      this.$('#sidebar').append(this.sidebarView.render().el);
    }
    return this;
  }
});

module.exports = AppView;
