/* global $, history */
import {View} from 'backbone';
import _ from 'underscore';
import jsyaml from 'js-yaml';

import BootstrapDialog from 'bootstrap-dialog';

import DialogView from './dialogView';
import ErrorView from './errorView';
import TableView from './tableView';

import loaderTemplate from './../../templates/loader.html';
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
      'click [data-gohan="update"]': 'update',
      'click [data-gohan="delete"]': 'delete'
    };
  }
  constructor(options) {
    super(options);

    this.app = options.app;
    this.errorView = this.app.ErrorClass ? new this.app.ErrorClass() : new ErrorView();
    this.template = options.template || detailTemplate;
    this.loaderTemplate = options.loaderTemplate || loaderTemplate;
    this.TableViewClass = options.TableViewClass || TableView;
    this.schema = options.schema;
    this.childview = options.childview;
    this.model = options.model;
    this.fragment = options.fragment;

    this.$el.html(this.loaderTemplate());
    this.model.fetch().then(
      () => this.render(),
      error => this.errorView.render(...error)
    );
  }
  dialogForm(action, formTitle, data, onsubmit, onhide) {
    this.schema.filterByAction(action, this.parentProperty).then(schema => {
      this.dialog = new DialogView({
        app: this.app,
        formTitle,
        data,
        onsubmit,
        onhide,
        unformattedSchema: this.schema,
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
  delete(event) {
    event.preventDefault();

    BootstrapDialog.confirm({
      title: 'Delete',
      message: 'Are you sure to delete?',
      closable: true,
      btnOKLabel: 'Delete',
      callback: result => {
        if (result) {
          this.model.destroy().then(
            () => {
              history.back();
            },
            error => {
              this.errorView.render(...error);
            }
          );
        }
      }
    });
  }
  update(event) {
    event.preventDefault();
    event.currentTarget.disabled = true;

    const model = this.model;
    const data = this.toLocal(model.toJSON());
    const action = 'update';
    const formTitle = '<h4>Update ' + this.schema.get('title') + '</h4>';
    const onhide = () => {
      event.currentTarget.disabled = false;
    };
    const onsubmit = values => {
      values = this.toServer(values);

      model.save(values, {wait: true}).then(
        () => {
          this.dialog.close();
          this.render();
        },
        error => {
          this.dialog.errorView.render(...error);
          this.dialog.stopSpin();
        }
      );
    };

    this.dialogForm(action, formTitle, data, onsubmit, onhide);
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
        return _.escape(relatedObject.name);
      }
    }

    if (property.type.includes('object') || (property.originalType && property.originalType.includes('object'))) {
      content = $('<pre style="width:500px;"></pre>').text(jsyaml.safeDump(value)).html();
      return '<pre>' + _.escape(content) + '</pre>';
    }

    if (property.type === 'array') {
      return '<pre>' + jsyaml.safeDump(value) + '</pre>';
    }
    if (property.type === 'string' && (property.format === 'yaml' || property.format === 'text')) {
      return '<pre>' + _.escape(value) + '</pre>';
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

    this.$el.html(this.template({
      data: result,
      schema: this.schema.toJSON(),
      children
    }));
    $('[data-gohan="error"]', this.el).append(this.errorView.el);
    this.app.router.changeTitle(this.model.get('name') || this.model.get('id'));
    this.model.getAncestors(ancestors => {
      ancestors.unshift(this.model);
      const parents = ancestors.reduce((result, ancestor, index) => {
        const fragment = ancestor.schema.get('url');
        let modelFragment;
        let schemaFragment;

        if (ancestor.schema.hasParent()) {
          modelFragment = ancestor.schema.parent().get('url') +
          '/' + ancestor.parentId() + '/' + ancestor.schema.get('plural') + '/' + ancestor.get('id');
          schemaFragment = ancestor.schema.parent().get('url') +
          '/' + ancestor.parentId() + '/' + ancestor.schema.get('plural');
        } else {
          modelFragment = ancestor.schema.get('url') + '/' + ancestor.get('id');
          schemaFragment = fragment;
        }
        result.push({
          title: ancestor.get('name'),
          url: modelFragment
        });
        if (ancestors.length === index + 1) {
          result.push({
            title: ancestor.schema.get('title'),
            url: schemaFragment
          });
        }
        return result;
      },
      []);
      parents.reverse();
      this.app.breadCrumb.update(parents);
    });

    this.schema.children().forEach(child => {
      const fragment = this.fragment + '/' + child.get('plural');
      const endpoint = this.schema.apiEndpointBase() + '/' + fragment;
      const collection = child.makeCollection(endpoint);
      const tableView = new this.TableViewClass({
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
