/* global $, window */
import {View, history} from 'backbone';
import _ from 'underscore';

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
    this.template = options.template || tableTemplate;
    this.dialogTemplate = options.dialogTemplate;
    this.app = options.app;
    this.schema = options.schema;
    this.fragment = options.fragment;
    this.childview = options.childview;
    this.polling = options.polling;
    this.activePage = Number(options.page) > 0 ? Number(options.page) - 1 : 0;
    this.activeFilter = {
      by: '',
      reverse: false
    };
    this.searchQuery = {
      sortKey: '',
      propField: ''
    };
    this.pageSize = 25;

    if (this.childview) {
      this.parentProperty = this.schema.get('parent') + '_id';
    }

    this.collection.fetch().then(() => {
      this.render();
      if ( this.polling ) {
        this.collection.startLongPolling();
      }
      this.listenTo(this.collection, 'update', this.render);
    }, (...param) => {
      this.errorView.render(param[1]);
    });
  }
  searchByKey(event) {
    this.searchQuery.sortKey = event.currentTarget.value;
    this.render();

    $('input.search', this.$el).focus().val('').val(this.searchQuery.sortKey);
    $('select.search', this.$el).val('').val(this.searchQuery.propField);
  }
  searchByField(event) {
    this.searchQuery.propField = event.currentTarget.value;
    this.render();

    $('input.search', this.$el).val('').val(this.searchQuery.sortKey);
    $('select.search', this.$el).focus().val('').val(this.searchQuery.propField);
  }
  filter(event) {
    const id = event.currentTarget.dataset.id;

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
  }
  pagination(event) {
    let newActivePage = event.currentTarget.dataset.id;

    if (newActivePage === 'next') {
      newActivePage = $('a', $('nav li.active', this.$el).next()).data('id');
    } else if (newActivePage === 'prev') {
      newActivePage = $('a', $('nav li.active', this.$el).prev()).data('id');
    }

    const activePage = $('nav li.active a', this.$el).data('id');
    const newPageIndicator = $('[data-id=' + newActivePage + ']', this.$el).parent();
    const activePageIndicator = $('[data-id=' + activePage + ']', this.$el).parent();

    $('#page' + activePage, this.$el).addClass('hidden');
    $('#page' + newActivePage, this.$el).removeClass('hidden');

    activePageIndicator.removeClass('active');
    newPageIndicator.addClass('active');

    $('li.disabled', this.$el).removeClass('disabled');

    if (newPageIndicator.next().children().data('id') === 'next') {
      newPageIndicator.next().addClass('disabled');
    } else if (newPageIndicator.prev().children().data('id') === 'prev') {
      newPageIndicator.prev().addClass('disabled');
    }

    history.navigate(history.getFragment().replace(/(\/page\/\w+)/, '') + '/page/' + newActivePage);
  }
  dialogForm(action, formTitle, data, onsubmit) {
    this.schema.filterByAction(action, this.parentProperty).then(schema => {
      this.dialog = new DialogView({
        template: this.dialogTemplate,
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
      this.collection.create(values, {wait: true}).then(() => {
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

      model.save(values, {wait: true}).then(() => {
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

    model.destroy({wait: true}).then(() => {
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

  /**
   * Filters array and return new array.
   * @param {Array} array
   * @param {string} searchQuery
   * @returns {Array}
   */
  filterArray(array, searchQuery) {
    if (this.searchQuery.sortKey === '') {
      return array;
    }
    return array.filter(value => {

      if (searchQuery.propField !== '') {
        const field = searchQuery.propField.toLowerCase();

        if (value.hasOwnProperty(field) && value[field].toString().includes(searchQuery.sortKey)) {
          return true;
        }
      } else {
        for (let key in value) {
          let val = value[key];

          if (val && val.toString().includes(searchQuery.sortKey.toString())) {
            return true;
          }
        }
      }

      return false;
    });
  }

  /**
   * Sorts array by specified property and return new array.
   * @param {Array} array
   * @param {string} by
   * @param {boolean} reverse
   * @returns {Array}
   */
  sortArray(array, by, reverse) {
    const sortedArray = _.sortBy(array, value => {
      if (by === '') {
        return value;
      }

      if (_.isString(value[by])) {
        return value[by].toLowerCase();
      }
      return value[by];
    });

    if (reverse === true) {
      return sortedArray.reverse();
    }
    return sortedArray;
  }
  render() {
    const self = this;

    let list = this.collection.map(model => {
      const data = model.toJSON();
      const result = Object.assign({}, data);

      for (let key in data) {
        result[key] = self.renderProperty(data, key);
      }
      return result;
    });

    list = this.filterArray(list, this.searchQuery);

    list = this.sortArray(list, this.activeFilter.by, this.activeFilter.reverse);

    const splitIntoPages = [];

    for (let i = 0; i < list.length; i += this.pageSize) {
      splitIntoPages.push(list.slice(i, i + this.pageSize));
    }
    list = splitIntoPages;

    if (this.app && !this.childview) {
      this.app.breadCrumb.update([this.collection]);
    }

    this.$el.html(this.template({
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
  }
  close() {
    if ( this.polling ) {
      this.collection.stopLongPolling();
    }
    this.remove();
  }
}
