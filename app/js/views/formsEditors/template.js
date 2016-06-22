import Backbone from 'backbone';
import _ from 'underscore';

import 'backbone-forms';
import 'backbone-forms/distribution/adapters/backbone.bootstrap-modal';

const Form = Backbone.Form;
Form.template = _.template(
  '<form class="gohan-form" role="form">' +
  '  <div id="alerts_form"></div>' +
  '  <div data-fieldsets></div>' +
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
  '<div class="nested-form-group field-<%= key  %>">' +
  '  <label class="control-label" for="<%= editorId %>"><%= title %></label>' +
  '  <% if (help) { %>' +
  '  <span class="help-description"> <%= help %></span>' +
  '  <% } %>' +
  '  <div class="controls">' +
  '    <span data-editor></span>' +
  '    <div class="help-block"><span class="error" data-error></span></div>' +
  '  </div>' +
  '</div>'
);

Form.NestedField.template = _.template(
  '<div class="nested-form-group field-<%= key  %>">' +
  '  <label class="control-label" for="<%= editorId %>"><%= title %></label>' +
  '  <% if (help) { %>' +
  '  <span class="help-description"> <%= help %></span>' +
  '  <% } %>' +
  '  <div class="controls">' +
  '    <span data-editor></span>' +
  '    <div class="help-block"><span class="error" data-error></span></div>' +
  '  </div>' +
  '</div>'
);

Form.editors.Base.prototype.className = 'form-control';
Form.Field.errorClassName = 'has-error';

if (Form.editors.List) {
  Form.editors.List.template = _.template(
    '<div class="list-container">' +
    '  <ul class="list-sortable" data-items></ul>' +
    '  <a class="add-item" data-action="add"><span class="fa fa-plus-circle"></span> Add Item</a>' +
    '</div>'
  );

  Form.editors.List.Item.template = _.template(
    '<li class="list-item-container">' +
    '  <div class="list-action">' +
    '    <span class="fa fa-minus-circle" data-action="remove" title="Remove Item"></span>' +
    '  </div>' +
    '  <div class="list-counter"></div>' +
    '  <div class="list-body">' +
    '    <span data-editor></span>' +
    '    <div class="help-block"><span class="error" data-error></span></div>' +
    '  </div>' +
    '  <div class="list-sort up">' +
    '    <a class="" data-action="move-left"><span class="fa fa-chevron-circle-up"></span>Up</a>' +
    '  </div>' +
    '  <div class="list-sort down">' +
    '    <a class="" data-action="move-right"><span class="fa fa-chevron-circle-down"></span>Down</a>' +
    '  </div>' +
    '</li>'
  );
}
