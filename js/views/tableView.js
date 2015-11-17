require('./../../bower_components/jsonform/lib/jsonform');

var Bootstrap = require('bootstrap');
var BootstrapDialog = require('bootstrap-dialog');
var ErrorView = require('./errorView');

require('./../../jst/templates');

var TableView = Backbone.View.extend({
  tagName: 'div',
  className: 'tableview',
  events: {
    'click .gohan_create': 'createModel',
    'click .gohan_delete': 'deleteModel',
    'click .gohan_update': 'updateModel'
  },
  initialize: function(options) {
    this.errorView = new ErrorView();
    this.app = options.app;
    this.schema = options.schema;
    this.fragment = options.fragment;
    this.childview = options.childview;
    if( this.childview ) {
      this.parent_property = this.schema.get('parent') + '_id';
    }
    this.listenTo(this.collection, 'update', this.render);
    this.collection.fetch({
       error: this.errorView.render
    });
  },
  dialogForm: function(action, form_title, data, onsubmit) {
    var self = this;
    var form = $('<form></form>', self.$el);
    form.jsonForm({
      schema: self.schema.filterByAction(action, self.parent_property),
      value: data,
      form: ['*'],
      onSubmit: function(errors, values) {
        if (errors) {
          self.dialog.getButton('submit').stopSpin();
          self.dialog.enableButtons(true);
          self.dialog.setClosable(true);
          return;
        }
        onsubmit(values);
      }
    });
    form.prepend('<div id="alerts_form"></div>');
    self.dialog = BootstrapDialog.show({
      size: BootstrapDialog.SIZE_WIDE,
      type: BootstrapDialog.TYPE_DEFAULT,
      title: form_title,
      closeByKeyboard: false,
      message: form,
      spinicon: 'glyphicon glyphicon-refresh',
      onshown: function() {
        $('.modal-body').css({
          'max-height': $(window).height() - 200 + 'px'
        });
      },
      buttons: [{
        id: 'submit',
        label: 'Submit',
        cssClass: 'btn-primary btn-raised btn-material-blue-600',
        action: function(dialog) {
          self.dialog.enableButtons(false);
          self.dialog.setClosable(false);
          this.spin();
          form.submit();
        }
      }]
    });
  },
  toLocal: function(data) {
    return this.schema.toLocal(data);
  },
  toServer: function(data) {
    return this.schema.toServer(data);
  },
  createModel: function (){
    var self = this;
    var data = self.toLocal({});
    var form_title = '<h4>Create ' + self.schema.get('title') + '</h4>';
    var action = 'create';
    var onsubmit = function (values) {
      values = self.toServer(values);
      values['_is_new'] = true;
      self.collection.create(values, {
        wait: true,
        success: function() {
          self.dialog.close();
          self.collection.fetch({
             success: function(){
               self.render()
             },
             error: self.errorView.render
          });
        },
        error: function(collection, response){
          self.errorView.render(collection, response);
          self.dialog.getButton('submit').stopSpin();
          self.dialog.enableButtons(true);
          self.dialog.setClosable(true);
      }});
    };
    self.dialogForm(action, form_title, data, onsubmit);
  },
  updateModel: function(evt) {
    var self = this;
    var target = $(evt.target);
    var id = target.data('id');
    var model = this.collection.get(id);
    var data = self.toLocal(model.toJSON());
    var action = 'update';
    var form_title = '<h4>Update ' + self.schema.get('title') + '</h4>';
    var onsubmit = function(values){
      var values = self.toServer(values);
      model.save(values, {
        patch: true,
        wait: true,
        success: function(){
          self.collection.trigger('update');
          self.dialog.close();
          self.collection.fetch({
             success: function(){
               self.render()
             },
             error: self.errorView.render
          });
        },
        error: function(collection, response){
          self.errorView.render(collection, response);
          self.dialog.getButton('submit').stopSpin();
          self.dialog.enableButtons(true);
          self.dialog.setClosable(true);
        }
      });
    };
    self.dialogForm(action, form_title, data, onsubmit);
  },
  deleteModel: function (evt){
    var target = $(evt.target);
    var id = target.data('id');
    var model = this.collection.get(id);
    model.destroy({'wait': 'true'});
  },
  renderProperty: function(data, key) {
    var content;
    var property = this.schema.get('schema').properties[key];
    var value = data[key];
    if (_.isUndefined(property)) {
      return '';
    }
    if (_.isUndefined(value)) {
      return '';
    }
    var related_object = data[property.relation_property];
    if (!_.isUndefined(related_object)) {
        if (!_.isUndefined(related_object.name)) {
          return related_object.name
        }
    }
    if (property.type == 'object') {
      content = $('<pre style="width:500px;"></pre>').text(
        '<pre>' + jsyaml.safeDump(value) + '</pre>').html();
      content = content.replace('\'', '&#34;');
      return JST['data_popup.html']({
        content: content
      });
    }
    if (property.type == 'array') {
      return '<pre>' + jsyaml.safeDump(value) + '</pre>';
    }
    var title = property.title.toLowerCase();
    if (title == 'name' || title == 'title')
    {
      return '<a href="#' + this.fragment + '/' + data.id + '">' + _.escape(value) + '</a>';
    }
    return value;
  },
  render: function() {
    var self = this;
    var list = this.collection.map(function(model) {
      var data = model.toJSON();
      var result = _.extend({}, data);
      _.each(data, function(value, key) {
        result[key] = self.renderProperty(data, key);
      });
      return result;
    });
    this.$el.html(JST['table.html']({
      'data': list,
      'schema': this.schema.toJSON(),
      'parent_property': this.parent_property
    }));
    this.$('button[data-toggle=hover]').popover();
    return this;
  }
});

module.exports = TableView;
