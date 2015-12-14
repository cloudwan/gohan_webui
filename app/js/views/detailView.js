var jsyaml = require('js-yaml');
var ErrorView = require('./errorView');
var TableView = require('./tableView');
var detailTemplate = require('./../../templates/detail.html');
var breadcrumbTemplate = require('./../../templates/breadcrumb.html');

var DetailView = Backbone.View.extend({
  tagName: 'div',
  className: 'detailview',
  initialize: function initialize(options) {
    this.errorView = new ErrorView();
    this.app = options.app;
    this.schema = options.schema;
    this.childview = options.childview;
    this.model = options.model;
    this.fragment = options.fragment;
    this.listenTo(this.model, 'sync', this.render);
    this.model.fetch({
      error: this.errorView.render
    });
  },
  renderProperty: function renderProperty(data, key) {
    var content;
    var property = this.schema.get('schema').properties[key];
    var value = data[key];

    if (_.isUndefined(value)) {
      return '';
    }

    if (_.isUndefined(property)) {
      return '';
    }

    var relatedObject = data[property.relation_property]; // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers

    if (!_.isUndefined(relatedObject)) {
        if (!_.isUndefined(relatedObject.name)) {
          return relatedObject.name;
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
  render: function render() {
    var self = this;
    var data = self.model.toJSON();
    var result = _.extend({}, data);

    _.each(data, function iterator(value, key) {
      result[key] = self.renderProperty(data, key);
    });
    var children = self.schema.children().map(function iterator(child) {
      var fragment = self.fragment + '/' + child.get('plural');

      return {
        id: child.id,
        title: child.get('title'),
        href: fragment
      };
    });

    self.$el.html(detailTemplate({
      data: result,
      schema: self.schema.toJSON(),
      children: children
    }));
    var makeBreadcrumb = function makeBreadcrumb(ancestors) {
      ancestors.unshift(self.model);
      var fragment = self.fragment;
      var parents = ancestors.map(function iterator(ancestor) {
          var modelFragment = fragment;

          fragment = fragment.replace(/\/[^\/]+$/, '');
          var schemaFragment = fragment;

          fragment = fragment.replace(/\/[^\/]+$/, '');

          if (ancestor.schema.hasParent() && self.childview) {
            schemaFragment = fragment;
          }
          return {
            title: ancestor.get('name'),
            schemaTitle: ancestor.schema.get('title'),
            fragment: modelFragment,
            schemaFragment: schemaFragment
          };
      });

      parents.reverse();
      $('#bread_crumb', self.$el).html(breadcrumbTemplate({
        parents: parents
      }));
    };

    if (self.childview) {
      self.model.getAncestors(makeBreadcrumb);
    } else {
      makeBreadcrumb([]);
    }
    self.schema.children().forEach(function iterator(child) {
      var fragment = self.fragment + '/' + child.get('plural');
      var endpoint = self.schema.apiEndpointBase() + '/' + fragment;
      var collection = child.makeCollection(endpoint);
      var tableView = new TableView({
        schema: child,
        collection: collection,
        childview: true,
        fragment: fragment,
        app: this.app
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

module.exports = DetailView;
