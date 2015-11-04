Gohan.DetailView = Backbone.View.extend({
  tagName: 'div',
  className: 'detailview',
  initialize: function(options) {
    this.app = options.app;
    this.schema = options.schema;
    this.childview = options.childview;
    this.model = options.model;
    this.fragment = options.fragment;
    this.listenTo(this.model, 'sync', this.render);
    this.model.fetch({
      error: Gohan.error
    });
  },
  renderProperty: function(data, key) {
    var content;
    var property = this.schema.get('schema').properties[key];
    var value = data[key];
    if (_.isUndefined(value)) {
      return '';
    }
    if (_.isUndefined(property)) {
      return '';
    }
    var related_object = data[property.relation_property];
    if (!_.isUndefined(related_object)) {
        if (!_.isUndefined(related_object.name)) {
          return related_object.name
        }
    }
    if (property.type == 'object') {
      content = $('<pre style="width:500px;"></pre>').text(jsyaml.safeDump(value)).html();
      return '<pre>' + _.escape(content) + '</pre>';
    }
    if (property.type == 'array') {
      return '<pre>' + jsyaml.safeDump(value) + '</pre>';
    }
    return _.escape(value);
  },
  // View methods
  // ------------
  render: function() {
    var self = this;
    var data = self.model.toJSON();
    var result = _.extend({}, data);
    _.each(data, function(value, key) {
      result[key] = self.renderProperty(data, key);
    });
    var children = self.schema.children().map(function (child){
      var fragment = self.fragment + '/' + child.get('plural');
      return {
        id: child.id,
        title: child.get('title'),
        href: fragment,
      };
    });
    self.$el.html(JST['detail.html']({
      'data': result,
      'schema': self.schema.toJSON(),
      'children': children
    }));
    var make_breadcrumb = function (ancestors){
      ancestors.unshift(self.model);
      var fragment = self.fragment;
      var parents = ancestors.map(function(ancestor){
          var model_fragment = fragment;
          fragment = fragment.replace(/\/[^\/]+$/, '');
          var schema_fragment = fragment;
          fragment = fragment.replace(/\/[^\/]+$/, '');
          if(ancestor.schema.hasParent() && self.childview){
            var schema_fragment = fragment;
          }
          return {
            title: ancestor.get('name'),
            schema_title: ancestor.schema.get('title'),
            fragment: model_fragment,
            schema_fragment: schema_fragment
          }
      });
      parents.reverse();
      $('#bread_crumb', self.$el).html(JST['breadcrumb.html']({
        parents: parents
      }));
    };
    if(self.childview){
      self.model.getAncestors(make_breadcrumb);
    }else{
      make_breadcrumb([]);
    }
    self.schema.children().forEach(function (child){
      var fragment = self.fragment + '/' + child.get('plural');
      var endpoint = self.schema.apiEndpointBase() + '/' + fragment;
      var collection = child.makeCollection(endpoint);
      var tableView = new Gohan.TableView({
        schema: child,
        collection: collection,
        childview: true,
        fragment: fragment,
        app: this.app,
      });
      $('div#' + child.id + '_table', self.$el).html(tableView.render().el);
      return {
        title: child.get('title'),
        href: fragment,
        element: tableView.render().el
      };
    });

    this.$('button[data-toggle=hover]').popover();
    return this;
  }
});
