import React from 'react';

import BaseView from './baseView';
import DialogView from './dialogView';
import ErrorView from './errorView';

import Table from './components/table.jsx';

export default class TableView extends BaseView {
  get tagname() {
    return 'div';
  }
  get classname() {
    return 'tableview';
  }

  constructor(options) {
    super(options);

    this.childview = options.childview;
    this.errorView = new ErrorView();
    this.searchInput = options.searchInput;
    this.tableRow = options.tableRow;

    this.polling = options.polling;
    this.collection = options.collection;
    this.schema = options.schema;
    this.app = options.app;
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

  makeDialog() {
    const data = this.schema.toLocal({});
    const formTitle = '<h4>Create ' + this.schema.get('title') + '</h4>';
    const action = 'create';
    const onsubmit = values => {
      values = this.schema.toServer(values);
      values.isNew = true;
      this.collection.create(values).then(() => {
        this.collection.fetch().then(() => {
          this.dialog.close();
          this.render();
        }, error => {
          this.errorView.render(...error);
        });
      }, error => {
        this.errorView.render(...error);
        this.dialog.stopSpin();
      });
    };

    this.dialogForm(action, formTitle, data, onsubmit);
  }

  editModel(event) {
    const target = event.target;
    const id = target.getAttribute('data-id');
    const model = this.collection.get(String(id));
    const data = this.schema.toLocal(model.toJSON());
    const action = 'update';
    const formTitle = '<h4>Update ' + this.schema.get('title') + '</h4>';
    const onsubmit = values => {
      values = this.schema.toServer(values);

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
    if (!window.confirm('Are you sure to delete?')) { // eslint-disable-line
      return;
    }
    const target = event.target;
    const id = target.getAttribute('data-id');
    const model = this.collection.get(String(id));

    model.destroy().then(() => {
      this.collection.fetch().catch(error => this.errorView.render(...error));
    }, error => this.errorView.render(...error));
  }

  component() {
    return React.createElement(Table, {
      collection: this.collection,
      app: this.app,
      childview: this.childview,
      schema: this.schema.toJSON(),
      makeDialog: this.makeDialog.bind(this),
      errorView: this.errorView,
      polling: this.polling,
      editModel: this.editModel.bind(this),
      deleteModel: this.deleteModel.bind(this),
      searchInput: this.searchInput,
      tableRow: this.tableRow
    });
  }
}
