/* global $, window */
import {View, history} from 'backbone';

import 'bootstrap';
import jsyaml from 'js-yaml';

import DialogView from './dialogView';
import ErrorView from './errorView';

import dataPopupTemplate from './../../templates/dataPopup.html';
import tableTemplate from './../../templates/table.html';

export default class TableView extends View {
  get tagName() {
    return 'div';
  }
  get className() {
    return 'tableview';
  }
  get events() {
    return {
      'click .gohan_create': 'createModel',
      'click .gohan_delete': 'deleteModel',
      'click .gohan_update': 'updateModel',
      'click a.title': 'filter',
      'keyup input.search': 'searchByKey',
      'change select.search': 'searchByField',
      'click nav li:not(.disabled) a': 'pagination'
    };
  }
  constructor(options) {
    super(options);

    this.errorView = new ErrorView();
    this.app = options.app;
    this.schema = options.schema;
    this.fragment = options.fragment;
    this.childview = options.childview;
    this.polling = options.polling;
    this.activePage = 1;
    this.pageLimit = options.collection.pageLimit || 10;
    this.activeFilter = {
      by: '',
      reverse: false
    };
    this.searchQuery = {
      sortKey: '',
      propField: ''
    };

    this.searchDelay = 500;
    this.searchTimeout = undefined;

    if (this.childview) {
      this.parentProperty = this.schema.get('parent') + '_id';
    }

    if (this.collection !== undefined) {
      this.collection.getPage().then(() => {
        this.searchQuery.propField = $('select.search').val();
        if ( this.polling ) {
          this.collection.startLongPolling();
        }
      }, (...params) => {
        this.errorView.render(params[0]);
      });
    }


    this.listenTo(this.collection, 'update', this.render);
  }
  searchByKey() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {

      this.fetchData();

    }, this.searchDelay);
  }
  searchByField() {
    this.fetchData();
  }
  fetchData() {
    const property = $('select.search').val();
    const value = $('input.search').val();

    this.searchQuery = {
      sortKey: value,
      propField: property
    };

    if (value === '') {
      this.fetchByQuery();
    } else {
      this.fetchByQuery(property, value);
    }
  }
  getPage(pageNo) {
    this.collection.getPage(pageNo - 1).then(() => {
      $('select.search').val(this.searchQuery.propField);
    }, (...params) => {
      this.errorView.render(params[0]);
    });
  }
  fetchByQuery(property, value) {
    this.activePage = 1;

    this.collection.resetFilters();
    this.collection.filter(property, value).then(() => {
      $('select.search').val(this.searchQuery.propField);
      $('input.search').focus().val(this.searchQuery.sortKey);

    }, (...params) => {
      this.errorView.render(params[0]);
    });
  }
  pagination(event) {
    let newActivePage = event.currentTarget.dataset.id;

    if (newActivePage === 'next') {
      newActivePage = Number(this.activePage) + 1;
    } else if (newActivePage === 'prev') {
      newActivePage = Number(this.activePage) - 1;
    }

    if (this.activePage === Number(newActivePage)) {
      return;
    }

    this.activePage = Number(newActivePage);

    this.getPage(Number(newActivePage));

    history.navigate(history.getFragment().replace(/(\/page\/\w+)/, '') + '/page/' + newActivePage);
  }
  dialogForm(action, formTitle, data, onsubmit) {
    this.schema.filterByAction(action, this.parentProperty).then(schema => {
      this.dialog = new DialogView({
        formTitle,
        data,
        onsubmit,
        schema: this.schema.toFormJSON(schema),
        unformattedSchema: this.schema,
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
  createModel() {
    const data = this.toLocal({});
    const formTitle = '<h4>Create ' + this.schema.get('title') + '</h4>';
    const action = 'create';
    const onsubmit = values => {
      values = this.toServer(values);
      values.isNew = true;
      this.collection.create(values).then(() => {
        this.dialog.close();
        this.render();
      }, error => {
        this.errorView.render(...error);
        this.dialog.stopSpin();
      });
    };

    this.dialogForm(action, formTitle, data, onsubmit);
  }
  updateModel(event) {
    const $target = $(event.target);
    const id = $target.data('id');
    const model = this.collection.get(String(id));
    const data = this.toLocal(model.toJSON());
    const action = 'update';
    const formTitle = '<h4>Update ' + this.schema.get('title') + '</h4>';
    const onsubmit = values => {
      values = this.toServer(values);

      model.save(values).then(() => {
        this.collection.trigger('update');
        this.dialog.close();
      }, error => {
        this.errorView.render(...error);
        this.dialog.stopSpin();
      });
    };

    this.dialogForm(action, formTitle, data, onsubmit);
  }
  deleteModel(event) {
    if (!window.confirm('Are you sure to delete?')) { // eslint-disable-line no-alert
      return;
    }
    const $target = $(event.target);
    const id = $target.data('id');
    const model = this.collection.get(String(id));

    model.destroy().then(() => {
      this.collection.fetch().catch(error => this.errorView.render(...error));
    }, error => this.errorView.render(...error));
  }
  renderProperty(data, key) {
    let content;
    const property = this.schema.get('schema').properties[key];
    const value = data[key];

    if (property === undefined) {
      return '';
    }

    if (value === undefined) {
      return '';
    }

    const relatedObject = data[property.relation_property]; // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers

    if (relatedObject !== undefined) {
      if (relatedObject.name !== undefined) {
        return relatedObject.name;
      }
    }
    try {
      if (property.type === 'object' || property.originalType === 'object') {
        content = $('<pre style="width:500px;"></pre>').text(
          '<pre>' + jsyaml.safeDump(value) + '</pre>').html();
        content = content.replace('\'', '&#34;');
        return dataPopupTemplate({
          content
        });
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (property.type === 'array') {
        return '<pre>' + jsyaml.safeDump(value) + '</pre>';
      }
    } catch (error) {
      console.error(error);
    }

    return value;
  }

  render() {
    let list = this.collection.map(model => {
      const data = model.toJSON();
      const result = Object.assign({}, data);

      for (let key in data) {
        result[key] = this.renderProperty(data, key);
      }
      return result;
    });

    const splitIntoPages = [];

    for (let i = 0; i < list.length; i += this.pageLimit) {
      splitIntoPages.push(list.slice(i, i + this.pageLimit));
    }
    list = splitIntoPages;

    if (this.app && !this.childview) {
      this.app.breadCrumb.update([this.collection]);
    }

    this.$el.html(tableTemplate({
      data: list,
      activePage: this.activePage,
      pageCount: this.collection.getPageCount(),
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
  }
  close() {
    if (this.polling) {
      this.collection.stopLongPolling();
    }
    if (this.collection) {
      this.collection.resetFilters();
    }
    this.remove();
  }
}
