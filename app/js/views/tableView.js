/* global $ */
import {View} from 'backbone';

import 'bootstrap';
import jsyaml from 'js-yaml';

import BootstrapDialog from 'bootstrap-dialog';

import DialogView from './dialogView';
import ErrorView from './errorView';

import loaderTemplate from './../../templates/loader.html';
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
      'click [data-gohan="create"]': 'createModel',
      'click [data-gohan="delete"]': 'deleteModel',
      'click [data-gohan="update"]': 'updateModel',
      'click [data-gohan="sort-title"]': 'sortData',
      'keyup [data-gohan="search"]': 'searchByKey',
      'change [data-gohan="search"]': 'searchByField',
      'click [data-gohan="pagination"] li:not(.disabled) a': 'paginationHandler',
      'click [data-gohan="toggle-row"]': 'toggleRow',
      'click [data-gohan="toggle-all-row"]': 'toggleAllRow',
      'click [data-gohan="delete-all"]': 'deleteSelectedModel'
    };
  }
  constructor(options) {
    super(options);

    this.app = options.app;
    this.errorView = this.app.ErrorClass ? new this.app.ErrorClass() : new ErrorView();
    this.template = options.template || tableTemplate;
    this.loaderTemplate = options.loaderTemplate || loaderTemplate;
    this.dialogTemplate = options.dialogTemplate;
    this.params = options.params;
    this.schema = options.schema;
    this.parent = options.parent;
    this.parentId = options.parentId;
    this.fragment = options.fragment;
    this.childview = options.childview;
    this.polling = options.polling;
    if (options.pageLimit !== undefined) {
      this.collection.pageLimit = Number(options.pageLimit);
    }
    if (this.params && this.params.page) {
      this.activePage = Number(this.params.page);
    } else {
      this.activePage = 1;
    }

    this.paginationSettings = {
      start: 1,
      limit: 7
    };
    this.activeSortFilter = {
      by: '',
      reverse: false
    };
    this.searchQuery = {
      property: 'name',
      value: undefined
    };

    this.searchDelay = 500;
    this.searchTimeout = undefined;

    if (this.childview) {
      this.parentProperty = (this.parent || this.schema.get('parent')) + '_id';
    }
    this.$el.html(this.loaderTemplate());

    if (this.collection !== undefined) {
      if (options.sortKey) {
        this.collection.sortKey = options.sortKey;
      }

      if (options.sortOrder) {
        this.collection.sortOrder = options.sortOrder;
      }
      this.collection.getPage(this.activePage - 1).then(() => {
        this.render();
        this.searchQuery.property = $('[data-gohan="search"] select', this.$el).val() || 'name';
        if (this.polling) {
          this.collection.startLongPolling();
        }
      }, error => {
        this.errorView.render(...error);
      });

      this.activeSortFilter.reverse = this.collection.sortOrder !== 'asc';
      this.activeSortFilter.by = this.collection.sortKey;
    }

    this.listenTo(this.collection, 'update', this.render);
  }
  searchByKey(event) {
    event.preventDefault();
    event.stopPropagation();

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      const value = $('[data-gohan="search"] input', this.$el).val();

      this.searchQuery.value = value || undefined;

      this.collection.filterByQuery(this.searchQuery.property, this.searchQuery.value).then(() => {
        $('[data-gohan="search"] input', this.$el).focus().val(this.searchQuery.value);
      }, error => {
        this.errorView.render(...error);
      });
    }, this.searchDelay);
  }
  searchByField(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!$('[data-gohan="search"] select', this.$el)) {
      return;
    }

    const property = $('[data-gohan="search"] select', this.$el).val();

    if (!property || this.searchQuery.property === property) {
      return;
    }
    this.searchQuery.property = property;

    if (this.searchQuery.value) {
      this.collection.filterByQuery(this.searchQuery.property, this.searchQuery.value).then(() => {
        $('[data-gohan="search"] select', this.$el).val(this.searchQuery.property);
      }, error => {
        this.errorView.render(...error);
      });
    }
  }
  getPage(pageNo) {
    this.collection.getPage(pageNo - 1).then(() => {
      $('[data-gohan="search"] select', this.$el).val(this.searchQuery.property);
    }, error => {
      this.errorView.render(...error);
    });
  }
  sortData(event) {
    event.preventDefault();
    event.stopPropagation();

    const id = event.currentTarget.dataset.id;

    if (this.activeSortFilter.by !== id) {
      this.activeSortFilter.by = id;
      this.activeSortFilter.reverse = false;
    } else if (this.activeSortFilter.by === id && !this.activeSortFilter.reverse) {
      this.activeSortFilter.reverse = true;
    } else {
      this.activeSortFilter.by = '';
      this.activeSortFilter.reverse = false;
    }

    const key = this.activeSortFilter.by;
    const order = this.activeSortFilter.reverse ? 'desc' : 'asc';

    this.collection.sort(key, order).then(() => {

    }, error => {
      this.errorView.render(...error);
    });
  }
  paginationHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    let newActivePage = event.currentTarget.dataset.id;
    let showMorePages = event.currentTarget.dataset.more;

    if (newActivePage === 'next') {
      newActivePage = Number(this.activePage) + 1;
    } else if (newActivePage === 'prev') {
      newActivePage = Number(this.activePage) - 1;
    }

    if (this.activePage === Number(newActivePage)) {
      return;
    }

    if (newActivePage === this.paginationSettings.start - 1) {
      showMorePages = 'left';
    } else if (newActivePage === this.paginationSettings.start + this.paginationSettings.limit - 1) {
      showMorePages = 'right';
    }

    if (showMorePages === 'right') {
      this.paginationSettings.start = Number(newActivePage);
    } else if (showMorePages === 'left') {
      this.paginationSettings.start = this.paginationSettings.start - this.paginationSettings.limit + 1;
      if (this.paginationSettings.start < 1)
        this.paginationSettings.start = 1;
    }

    this.activePage = Number(newActivePage);

    if (!this.childview) {
      this.app.router.setQueryParams({page: this.activePage});
    }

    this.getPage(Number(newActivePage));
  }
  toggleRow(event) {
    event.preventDefault();
    event.stopPropagation();

    const $target = $(event.currentTarget);
    const id = $target.data('id');
    const model = this.collection.get(String(id));

    model.isSelected = !model.isSelected;
    this.render();
  }
  toggleAllRow(event) {
    event.preventDefault();
    event.stopPropagation();

    const selected = this.collection.some(model => {
      return model.isSelected;
    });

    this.collection.each(model => {
      model.isSelected = !selected;
    });
    this.render();
  }
  dialogForm(action, formTitle, data, onsubmit, onhide) {
    this.schema.filterByAction(action, this.parentProperty).then(schema => {
      this.dialog = new DialogView({
        app: this.app,
        template: this.dialogTemplate,
        formTitle,
        data,
        onsubmit,
        onhide,
        schema: this.schema.toFormJSON(schema),
        unformattedSchema: this.schema,
        fields: schema.propertiesOrder,
        action
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
  createModel(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.disabled = true;

    const data = this.toLocal({});
    const formTitle = '<h4>Create ' + this.schema.get('title') + '</h4>';
    const action = 'create';
    const onhide = () => {
      event.currentTarget.disabled = false;
    };
    const onsubmit = values => {
      values = this.toServer(values);
      values.isNew = true;
      if (this.parentId) {
        Object.assign(values, {[this.parent + '_id']: this.parentId});
      }
      this.collection.create(values, {wait: true}).then(() => {
        this.dialog.close();
        this.collection.fetch();
      }, error => {
        this.dialog.errorView.render(...error);
        this.dialog.stopSpin();
      });
    };

    this.dialogForm(action, formTitle, data, onsubmit, onhide);
  }
  updateModel(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.disabled = true;

    const $target = $(event.currentTarget);
    const id = $target.data('id');
    const model = this.collection.get(String(id));
    const data = this.toLocal(model.toJSON());
    const action = 'update';
    const formTitle = '<h4>Update ' + this.schema.get('title') + '</h4>';
    const onhide = () => {
      event.currentTarget.disabled = false;
    };
    const onsubmit = values => {
      values = this.toServer(values);

      model.save(values, {wait: true}).then(() => {
        this.collection.trigger('update');
        this.dialog.close();
        event.currentTarget.disabled = false;
      }, error => {
        this.dialog.errorView.render(...error);
        this.dialog.stopSpin();
      });
    };

    this.dialogForm(action, formTitle, data, onsubmit, onhide);
  }
  deleteModel(event) {
    event.preventDefault();
    event.stopPropagation();

    BootstrapDialog.confirm({
      title: 'Delete',
      message: 'Are you sure to delete?',
      closable: true,
      btnOKLabel: 'Delete',
      callback: result => {
        if (result) {
          const $target = $(event.currentTarget);
          const id = $target.data('id');
          const model = this.collection.get(String(id));

          model.isDeleting = true;
          this.render();
          model.destroy({wait: true}).then(() => {
            this.collection.fetch().catch(error => this.errorView.render(...error));
          },
          error => {
            model.isDeleting = false;
            this.render();
            this.errorView.render(...error);
          });
        }
      }
    });
  }
  deleteSelectedModel(event) {
    event.preventDefault();
    event.stopPropagation();

    BootstrapDialog.confirm({
      title: 'Delete',
      message: 'Are you sure to delete?',
      closable: true,
      btnOKLabel: 'Delete',
      callback: result => {
        if (result) {
          this.collection.each(model => {
            if (model.isSelected && !model.isDeleting) {
              model.isDeleting = true;
              model.destroy({wait: true}).then(() => {
                this.collection.fetch().catch(error => this.errorView.render(...error));
              },
              error => {
                model.isDeleting = false;
                this.render();
                this.errorView.render(...error);
              });
            }
          });
          this.render();
        }
      }
    });
  }
  renderProperty(data, key) {
    let content;
    const property = this.schema.get('schema').properties[key];
    const value = data[key];

    if (property === undefined) {
      return value;
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
      if (property.type.includes('object') || (property.originalType && property.originalType.includes('object'))) {
        content = $('<pre style="width:500px;"></pre>').text(
          '<pre>' + jsyaml.safeDump(value) + '</pre>').html();
        content = content.replace(/\'/g, '&#39;');
        return dataPopupTemplate({
          content
        });
      }
    } catch (error) {
      console.error(error);
    }

    try {
      if (property.type.includes('array')) {
        return '<pre>' + jsyaml.safeDump(value) + '</pre>';
      }
    } catch (error) {
      console.error(error);
    }

    return value;
  }

  render() {
    const list = this.collection.map(model => {
      const data = model.toJSON();
      const result = Object.assign({}, data);

      for (let key in data) {
        result[key] = this.renderProperty(data, key);
      }
      return result;
    });
    const uiState = this.collection.map(model => {
      return {
        isSelected: model.isSelected,
        isDeleting: model.isDeleting
      };
    });
    if (this.app && !this.childview) {
      this.app.router.changeTitle(this.schema.get('title'));
      const parents = [];
      const fragment = this.collection.schema.get('url');
      let schemaFragment;
      if (this.collection.schema.hasParent()) {
        schemaFragment = this.collection.schema.parent().get('url') +
          '/' + this.collection.parentId() + '/' + this.collection.schema.get('plural');
      } else {
        schemaFragment = fragment;
      }
      parents.push(
        {
          title: this.collection.schema.get('title'),
          url: schemaFragment
        });

      parents.reverse();
      this.app.breadCrumb.update(parents);
    }

    this.$el.html(this.template({
      data: list,
      uiState,
      activePage: this.activePage,
      pageCount: this.collection.getPageCount(),
      schema: this.schema.toJSON(),
      searchQuery: this.searchQuery,
      sort: this.activeSortFilter,
      parentProperty: this.parentProperty,
      pagination: this.paginationSettings,
      fragment: this.fragment,
      params: this.params
    }));
    $('a[data-toggle="popover"]', this.el).popover();
    $('a[data-toggle="tooltip"]', this.el).tooltip();
    $('[data-gohan="error"]', this.el).append(this.errorView.el);
    return this;
  }
  close() {
    if (!this.childview) {
      this.app.router.setQueryParams();
    }
    if (this.polling) {
      this.collection.stopLongPolling();
    }
    if (this.collection) {
      this.collection.resetFilters();
    }
    this.remove();
  }
}
