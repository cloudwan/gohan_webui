require('./../../bower_components/jsonform/lib/jsonform');

var Bootstrap = require('bootstrap');
var BootstrapDialog = require('bootstrap-dialog');
var ErrorView = require('./errorView');
var jsyaml = require('js-yaml');
var templates = require('./../../jst/templates');

var TableView = Backbone.View.extend({
  tagName: 'div',
  className: 'tableview',
  events: {
    'click .gohan_create': 'createModel',
    'click .gohan_delete': 'deleteModel',
    'click .gohan_update': 'updateModel'
  },
  initialize: function initialize(options) {
    this.errorView = new ErrorView();
    this.app = options.app;
    this.schema = options.schema;
    this.fragment = options.fragment;
    this.childview = options.childview;

    if ( this.childview ) {
      this.parentProperty = this.schema.get('parent') + '_id';
    }

    this.listenTo(this.collection, 'update', this.render);
    this.collection.fetch({
       error: this.errorView.render
    });
  },
  dialogForm: function dialogForm(action, formTitle, data, onsubmit) {
    var self = this;
    var result = {};
    var $form = $('<form></form>', self.$el);
    var additionalForm = self.schema.additionalForm;
    var concatResult = function concatResult(value) {
      result = _.extend(result, value);
    };
    var createForm = function createForm(step) {
      var currentForm = additionalForm;

      if (!_.isUndefined(step)) {
        currentForm = additionalForm[step];

        if (step >= additionalForm.length) {
          onsubmit(result);
          return;
        }
      }

      $form.html('');
      $form.jsonForm({
        schema: self.schema.filterByAction(action, self.parentProperty),
        value: data,
        form: currentForm,
        onSubmit: function onSubmit(errors, values) {
          self.dialog.getButton('submit').stopSpin();
          self.dialog.enableButtons(true);
          self.dialog.setClosable(true);

          if (errors) {
            return;
          }

          if (step === additionalForm.length - 2) {
            self.dialog.getButton('submit').text('Submit');
          }

          if (_.isUndefined(step)) {
            onsubmit(values);
          } else {
            concatResult(values);
            createForm(step + 1);
          }
        }
      });

      $form.prepend('<div id="alerts_form"></div>');

      if (_.isUndefined(self.dialog)) {
        self.dialog = BootstrapDialog.show({
          size: BootstrapDialog.SIZE_WIDE,
          type: BootstrapDialog.TYPE_DEFAULT,
          title: formTitle,
          closeByKeyboard: false,
          message: $form,
          spinicon: 'glyphicon glyphicon-refresh',
          onshown: function onshown() {
            $('.modal-body').css({
              'max-height': $(window).height() - 200 + 'px'
            });
          },
          onhide: function onhide() {
            delete self.dialog;
          },
          buttons: [{
            id: 'submit',
            label: _.isUndefined(step) ? 'Submit' : 'Next',
            cssClass: 'btn-primary btn-raised btn-material-blue-600',
            action: function action() {
              self.dialog.enableButtons(false);
              self.dialog.setClosable(false);
              this.spin();
              $form.submit();
            }
          }]
        });
      }
    };

    if (_.isArray(additionalForm[0]) && action === 'create') {
      createForm(0);
    } else {
      if (action === 'update') {
        additionalForm = ['*'];
      }
      createForm();
    }
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
          self.dialog.close();
          self.collection.fetch({
             success: function success() {
               self.render();
             },
             error: self.errorView.render
          });
        },
        error: function error(collection, response) {
          self.errorView.render(collection, response);
          self.dialog.getButton('submit').stopSpin();
          self.dialog.enableButtons(true);
          self.dialog.setClosable(true);
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
          self.dialog.close();
          self.collection.fetch({
             success: function success() {
               self.render();
             },
             error: self.errorView.render
          });
        },
        error: function error(collection, response) {
          self.errorView.render(collection, response);
          self.dialog.getButton('submit').stopSpin();
          self.dialog.enableButtons(true);
          self.dialog.setClosable(true);
        }
      });
    };

    self.dialogForm(action, formTitle, data, onsubmit);
  },
  deleteModel: function deleteModel(evt) {
    var $target = $(evt.target);
    var id = $target.data('id');
    var model = this.collection.get(id);

    model.destroy({wait: 'true'});
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
      return '<a href="#' + this.fragment + '/' + data.id + '">' + _.escape(value) + '</a>';
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

    this.$el.html(templates.table({
      data: list,
      schema: this.schema.toJSON(),
      parentProperty: this.parentProperty
    }));
    this.$('button[data-toggle=hover]').popover();
    return this;
  }
});

module.exports = TableView;
