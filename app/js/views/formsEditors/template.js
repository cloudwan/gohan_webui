import Backbone from 'backbone';
import _ from 'underscore';

import 'backbone-forms';
import 'backbone-forms/distribution/adapters/backbone.bootstrap-modal';

const Form = Backbone.Form;
Form.template = _.template(
  '<form class="form-horizontal" role="form" data-fieldsets>' +
  '  <div id="alerts_form"></div>' +
  '</form>'
);

Form.Fieldset.template = _.template(
  '<fieldset data-fields>' +
  '  <% if (legend) { %>' +
  '  <legend><%= legend %></legend>' +
  '  <% } %>' +
  '</fieldset>'
);

Form.Field.template = _.template(
  '<div class="form-group jsonform-node jsonform-error-resource---properties field-<%= key %>">' +
  '  <label class="control-label" for="<%= editorId %>"><%= title %></label>' +
  '  <div class="controls">' +
  '    <span data-editor></span>' +
  '    <p class="help-block" data-error></p>' +
  '    <p class="help-block"><%= help %></p>' +
  '  </div>' +
  '</div>'
);

Form.NestedField.template = _.template(
  '<div class="field-<%= key  %>">' +
  '  <div title="<%= title %>" class="input-xlarge">' +
  '    <%= title %>' +
  '    <span data-editor></span>' +
  '    <div class="help-inline" data-error></div>' +
  '  </div>' +
  '  <div class="help-block"><%= help %></div>' +
  '</div>'
);

Form.editors.Base.prototype.className = 'form-control';
Form.Field.errorClassName = 'has-error';

if (Form.editors.List) {
  Form.editors.List.template = _.template(
    '<div class="bbf-list">' +
    '  <ul class="ui-sortable" style="list-style-type:none;" data-items></ul>' +
    '  <span class="_jsonform-array-buttons">' +
    '    <a href="#" class="btn btn-default" data-action="add">' +
    '      <i class="glyphicon glyphicon-plus-sign" title="Add new"></i>' +
    '    </a>' +
    '  </span>' +
    '</div>'
  );

  Form.editors.List.Item.template = _.template(
    '<li data-idx="0">' +
    '  <span class="draggable line">' +
    '    <i class="glyphicon glyphicon-list" title="Move item"></i>' +
    '  </span>' +
    '  <a href="#" style="display: inline;">' +
    '    <i class="glyphicon glyphicon-remove" style="float:right;" data-action="remove" title="Remove item"></i>' +
    '  </a>' +
    '  <div class="form-group jsonform-node">' +
    '    <span class="controls" data-editor></span>' +
    '    <div class="help-inline" data-error></div>' +
    '  </div>' +
    '</li>'
  );

  Form.editors.List.Object.template = Form.editors.List.NestedModel.template = _.template(
    '<div class="bbf-list-modal"><%= summary %></div>'
  );
}
