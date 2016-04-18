/* global $ */
import {View} from 'backbone';
import _ from 'underscore';
import jsyaml from 'js-yaml';

import DialogView from './dialogView';
import ErrorView from './errorView';
import TableView from './tableView';

import detailTemplate from './../../templates/detail.html';

export default class DetailView extends View {
  get tagName() {
    return 'div';
  }

  get className() {
    return 'detailview';
  }

  get events() {
    return {
      'click a.edit': 'update'
    };
  }
  constructor(options) {
    super(options);

    this.errorView = new ErrorView();
    this.app = options.app;
    this.schema = options.schema;
    this.childview = options.childview;
    this.model = options.model;
    this.fragment = options.fragment;
    this.model.fetch().then(
      () => this.render(),
      error => this.errorView.render(...error)
    );
  }
  dialogForm(action, formTitle, data, onsubmit) {

    this.schema.filterByAction(action, this.parentProperty).then(schema => {
      this.dialog = new DialogView({
        formTitle,
        data,
        onsubmit,
        schema: this.schema.toFormJSON(schema),
        fields: schema.propertiesOrder
      });
      this.dialog.render();
    });
  }
  toLocal(data) {
    return this.schema.toLocal(data);
  }
  toServer(data) {
    return this.schema.toServer(data);
  }
  update() {
    const model = this.model;
    const data = this.toLocal(model.toJSON());
    const action = 'update';
    const formTitle = '<h4>Update ' + this.schema.get('title') + '</h4>';
    const onsubmit = values => {
      values = this.toServer(values);

      model.save(values).then(
        () => {
          this.dialog.close();
          this.render();
        },
        (collection, response) => {
          this.errorView.render(collection, response);
          this.dialog.stopSpin();
        }
      );
    };

    this.dialogForm(action, formTitle, data, onsubmit);
  }
  renderProperty(data, key) {
    let content;
    const property = this.schema.get('schema').properties[key];
    const value = data[key];

    if (value === undefined) {
      return '';
    }

    if (property === undefined) {
      return '';
    }

    const relatedObject = data[property.relation_property]; // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers

    if (relatedObject !== undefined) {
      if (relatedObject.name !== undefined) {
        return relatedObject.name;
      }
    }

    if (property.type === 'object') {
      content = $('<pre style="width:500px;"></pre>').text(jsyaml.safeDump(value)).html();
      return '<pre>' + _.escape(content) + '</pre>';
    }

    if (property.type === 'array') {
      return '<pre>' + jsyaml.safeDump(value) + '</pre>';
    }

    return _.escape(value);
  }
  render() {
    const data = this.model.toJSON();
    const result = Object.assign({}, data);

    for (let key in data) {
      result[key] = this.renderProperty(data, key);
    }
    const children = this.schema.children().map(child => {
      const fragment = this.fragment + '/' + child.get('plural');

      return {
        id: child.id,
        title: child.get('title'),
        href: fragment
      };
    });

    this.$el.html(detailTemplate({
      data: result,
      schema: this.schema.toJSON(),
      children
    }));

    if (this.childview) {
      this.model.getAncestors(ancestors => {
        ancestors.unshift(this.model);
        this.app.breadCrumb.update(ancestors, this.childview);
      });
    } else {
      const ancestors = [];

      ancestors.unshift(this.model);
      this.app.breadCrumb.update(ancestors, this.childview);
    }
    this.schema.children().forEach(child => {
      const fragment = this.fragment + '/' + child.get('plural');
      const endpoint = this.schema.apiEndpointBase() + '/' + fragment;
      const collection = child.makeCollection(endpoint);
      const tableView = new TableView({
        schema: child,
        collection,
        childview: true,
        fragment: this.fragment + '/' + child.get('plural'),
        app: this.app
      });

      $('div#' + child.id + '_table', this.$el).html(tableView.render().el);
      return {
        title: child.get('title'),
        href: fragment,
        element: tableView.render().el
      };
    });

    this.$('button[data-toggle=hover]').popover();
    return this;
  }
}
