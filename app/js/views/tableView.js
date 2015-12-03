var Bootstrap = require('bootstrap');
var DialogView = require('./dialogView');
var ErrorView = require('./errorView');
var jsyaml = require('js-yaml');
var templates = require('./../../jst/templates');

var TableView = Backbone.View.extend({
  tagName: 'div',
  className: 'tableview',
  events: {
    'click .gohan_create': 'createModel',
    'click .gohan_delete': 'deleteModel',
    'click .gohan_update': 'updateModel',
    'click a.title': 'filter',
    'keyup input.search': 'search',
    'click nav li:not(.disabled) a': 'pagination'
  },

  initialize: function initialize(options) {
    this.errorView = new ErrorView();
    this.app = options.app;
    this.schema = options.schema;
    this.fragment = options.fragment;
    this.childview = options.childview;
    this.activePage = Number(options.page) > 0 ? Number(options.page) - 1 : 0;
    this.activeFilter = {
      by: '',
      reverse: false
    };
    this.searchQuery = '';

    if ( this.childview ) {
      this.parentProperty = this.schema.get('parent') + '_id';
    }

    this.listenTo(this.collection, 'update', this.render);
    this.collection.fetch({
       error: this.errorView.render
    });
    this.collection.startLongPolling();
  },
  search: function search(event) {
    this.searchQuery = event.currentTarget.value;
    this.render();

    $('input.search', this.$el).focus().val('').val(this.searchQuery);
  },
  filter: function filter(event) {
    var id = event.currentTarget.dataset.id;

    if (this.activeFilter.by !== id) {
      this.activeFilter.by = id;
      this.activeFilter.reverse = false;
    } else if (this.activeFilter.by === id && !this.activeFilter.reverse) {
      this.activeFilter.reverse = true;
    } else {
      this.activeFilter.by = '';
      this.activeFilter.reverse = false;
    }
    this.render();
  },
  pagination: function pagination(event) {
    var newActivePage = event.currentTarget.dataset.id;

    if (newActivePage === 'next') {
      newActivePage = $('a', $('nav li.active', this.$el).next()).data('id');
    } else if (newActivePage === 'prev') {
      newActivePage = $('a', $('nav li.active', this.$el).prev()).data('id');
    }

    var activePage = $('nav li.active a', this.$el).data('id');
    var newPageIndicator = $('[data-id=' + newActivePage + ']', this.$el).parent();
    var activePageIndicator = $('[data-id=' + activePage + ']', this.$el).parent();

    $('#page' + activePage).hide();
    $('#page' + newActivePage).show();

    activePageIndicator.removeClass('active');
    newPageIndicator.addClass('active');

    $('li.disabled', this.$el).removeClass('disabled');

    if (newPageIndicator.next().children().data('id') === 'next') {
      newPageIndicator.next().addClass('disabled');
    } else if (newPageIndicator.prev().children().data('id') === 'prev') {
      newPageIndicator.prev().addClass('disabled');
    }

    this.app.router.navigate(Backbone.history.getFragment().replace(/(\/page\/\w+)/, '') + '/page/' + newActivePage);
  },
  dialogForm: function dialogForm(action, formTitle, data, onsubmit) {
    this.dialog = new DialogView({
      action: action,
      formTitle: formTitle,
      data: data,
      onsubmit: onsubmit,
      schema: this.schema
    });

    this.dialog.render();
  },
  toLocal: function toLocal(data) {
    return this.schema.toLocal(data);
  },
  toServer: function toServer(data) {
    return this.schema.toServer(data);
  },
  createModel: function createModel() {
    var self = this;
    var data = self.toLocal({});
    var formTitle = '<h4>Create ' + self.schema.get('title') + '</h4>';
    var action = 'create';
    var onsubmit = function onsubmit(values) {
      values = self.toServer(values);
      values.isNew = true;
      self.collection.create(values, {
        wait: true,
        success: function success() {
          self.collection.fetch({
             success: function success() {
               self.dialog.close();
               self.render();
             },
             error: self.errorView.render
          });
        },
        error: function error(collection, response) {
          self.errorView.render(collection, response);
          self.dialog.stopSpin();
      }});
    };

    self.dialogForm(action, formTitle, data, onsubmit);
  },
  updateModel: function updateModel(evt) {
    var self = this;
    var $target = $(evt.target);
    var id = $target.data('id');
    var model = this.collection.get(id);
    var data = self.toLocal(model.toJSON());
    var action = 'update';
    var formTitle = '<h4>Update ' + self.schema.get('title') + '</h4>';
    var onsubmit = function onsubmit(values) {
      var values = self.toServer(values);

      model.save(values, {
        patch: true,
        wait: true,
        success: function success() {
          self.collection.trigger('update');
          self.collection.fetch({
             success: function success() {
               self.render();
             },
             error: self.errorView.render
          });
        },
        error: function error(collection, response) {
          self.errorView.render(collection, response);
          self.dialog.stopSpin();
        }
      });
    };

    self.dialogForm(action, formTitle, data, onsubmit);
  },
  deleteModel: function deleteModel(evt) {
    var $target = $(evt.target);
    var id = $target.data('id');
    var model = this.collection.get(id);

    model.destroy({
      wait: 'true',
      error: this.errorView.render
    });
  },
  renderProperty: function renderProperty(data, key) {
    var content;
    var property = this.schema.get('schema').properties[key];
    var value = data[key];

    if (_.isUndefined(property)) {
      return '';
    }

    if (_.isUndefined(value)) {
      return '';
    }

    var relatedObject = data[property.relation_property]; // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers

    if (!_.isUndefined(relatedObject)) {
        if (!_.isUndefined(relatedObject.name)) {
          return relatedObject.name;
        }
    }

    if (property.type == 'object') {
      content = $('<pre style="width:500px;"></pre>').text(
        '<pre>' + jsyaml.safeDump(value) + '</pre>').html();
      content = content.replace('\'', '&#34;');
      return templates.dataPopup({
        content: content
      });
    }

    if (property.type == 'array') {
      return '<pre>' + jsyaml.safeDump(value) + '</pre>';
    }

    var title = property.title.toLowerCase();

    if (title == 'name' || title == 'title') {
      return '<a data-id="' + value + '"href="#' + this.fragment + '/' + data.id + '">' + _.escape(value) + '</a>';
    }
    return value;
  },
  render: function render() {
    var self = this;
    var list = this.collection.map(function iterator(model) {
      var data = model.toJSON();
      var result = _.extend({}, data);

      _.each(data, function iterator(value, key) {
        result[key] = self.renderProperty(data, key);
      });
      return result;
    });

    if (this.searchQuery !== '') {
      list = _.filter(list, function iterator(value) {
        var result = 0;

        _.forEach(value, function iterator(val) {
          if (val && val.toString().indexOf(self.searchQuery) !== -1) {
            result = 1;
          }
        });
        return result;
      });
    }

    list = _.sortBy(list, function iterator(value) {
      if (self.activeFilter.by === '') {
        return value;
      }

      if (_.isString(value[self.activeFilter.by])) {
        return value[self.activeFilter.by].toLowerCase();
      }
      return value[self.activeFilter.by];
    });

    if (this.activeFilter.reverse === true) {
      list = list.reverse();
    }
    this.pageSize = 10;
    var tmp = [];

    for (var i = 0; i < list.length; i += this.pageSize) {
      tmp.push(list.slice(i, i + this.pageSize));
    }

    list = tmp;

    this.$el.html(templates.table({
      data: list,
      activePage: this.activePage,
      schema: this.schema.toJSON(),
      searchQuery: this.searchQuery,
      sort: {
        by: this.activeFilter.by,
        reverse: this.activeFilter.reverse
      },
      parentProperty: this.parentProperty
    }));
    this.$('button[data-toggle=hover]').popover();
    return this;
  },
  close: function close() {
    this.collection.stopLongPolling();
    this.remove();
  }
});

module.exports = TableView;
