//app
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
    },
    AppView: Backbone.View.extend({
      mainview: null,
      className: 'appview',
      initialize: function(options) {
        var self = this;
        self.router = options.router;
        var config = options.config;
        self.config = config;
        self.viewClass = options.viewClass || {};

        if (config.auth_url.indexOf('__HOST__') > 0) {
          config.auth_url = config.auth_url.replace(
            '__HOST__', window.location.hostname);
        }
        if (config.gohan.url.indexOf('__HOST__') > 0) {
          config.gohan.url = config.gohan.url.replace(
            '__HOST__', window.location.hostname);
        }

        self.userModel = options.userModel;

        if(_.isUndefined(self.userModel)){
          self.userModel = new Gohan.UserModel({
            url: self.config.auth_url + '/tokens'
          });
        }

        self.buildView();

        self.schemas = options.scheams;

        if(_.isUndefined(self.schemas)){
          self.schemas = new Gohan.SchemaCollection({
            base_url: self.config.gohan.url,
            userModel: self.userModel,
            url: self.config.gohan.url + self.config.gohan.schema,
          });
        }

        self.listenTo(self.schemas, 'update', self.autoBuildUI);

        if(self.userModel.authToken()){
          self.schemas.fetch({
            'error': Gohan.error
          });
        }else{
          self.listenTo(self.userModel, 'change:auth_data', function () {
            self.$('#main_body').empty();
            self.schemas.fetch();
            self.render();
          });
        }
      },
      buildView: function(){
        this.sidebar_view = new Gohan.SidebarView({
          collection: new Backbone.Collection()
        });
        this.header_view = new Gohan.HeaderView({
          config: this.config,
          model: this.userModel
        });
      },
      get_param_from_query: function(){
        var params = {};
        var query_strings = document.location.search.substr(1)
        if (query_strings === '') {
            return params;
        }
        _.each(query_strings.split('&'), function(query){
            console.log(query)
            var i = query.split('=');
            params[i[0].toString()] = i[1].toString();
        });
        return params
      },
      autoBuildUIForSchema: function (schema){
        var self = this;
        var metadata = schema.get('metadata');
        var params = self.get_param_from_query()
        var type = params['type'] || 'tenant'
        if(metadata && metadata.type != type){
            return
        }
        var viewClass = {
          table: Gohan.TableView,
          detail: Gohan.DetailView
        };
        _.extend(viewClass, self.viewClass[schema.id]);
        var collection =  schema.makeCollection();
        if(schema.hasParent()){
          var full_route = schema.prefix();
          full_route = full_route.substr(1);

          var child_table_view = function(){
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

          var child_detail_view = function() {
            $('#alerts').empty();
            var id = arguments[arguments.length - 2];
            var model = collection.get(id);

            if(_.isUndefined(model)){
              model = new collection.model({'id': id});
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
          self.router.route(full_route, 'child_table_view', child_table_view);
          self.router.route(full_route + '/:id', 'detail_view', child_detail_view);
        }else{
          var route = schema.get('prefix');
          route = route.substr(1);
          var sidebar_menu = self.sidebar_view.collection.push({
            path: '#' + route,
            title: schema.get('title'),
          });
          var table_view = function(id) {
            $('#alerts').empty();
            var tableView = new viewClass.table({
              schema: schema,
              collection: collection,
              fragment: Backbone.history.fragment,
              app: self
            });
            self.$('#main_body').html(tableView.render().el);
            self.$('#main').addClass('active');
            self.sidebar_view.select(sidebar_menu);
          };

          var detail_view = function(id) {
            $('#alerts').empty();
            var model = collection.get(id);
            if(_.isUndefined(model)){
              model = new collection.model({'id': id});
            }
            var detailView = new viewClass.detail({
              schema: schema,
              model: model,
              fragment: Backbone.history.fragment,
              app: self
            });
            self.$('#main_body').html(detailView.render().el);
            self.$('#main').addClass('active');
            self.sidebar_view.select(sidebar_menu);
          };

          self.router.route(route, 'table_view', table_view);
          self.router.route(route + '/:id', 'detail_view', detail_view);

        }
      },
      autoBuildUI: function() {
        var self = this;
        self.schemas.each(function(schema){
          self.autoBuildUIForSchema(schema)
        });
        Backbone.history.loadUrl(Backbone.history.fragment);
      },
      login: function(){
        var loginView = new Gohan.LoginView({
          model: this.userModel
        });
        this.$el.html(loginView.render().el);
      },
      render: function() {
        if(!this.userModel.authToken()){
          this.login();
        }else{
          this.$el.html(JST['app.html']());
          this.$('#header').append(this.header_view.render().el);
          this.$('#sidebar').append(this.sidebar_view.render().el);
        }
        return this;
      }})
  };
  if (!window.Gohan) window.Gohan = {};
  _.extend(Gohan, app);
})();
