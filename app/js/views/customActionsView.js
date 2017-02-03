import {View} from 'backbone';
import BootstrapDialog from 'bootstrap-dialog';

import DialogView from './dialogView';

import template from '../../templates/customActions.html';

/**
 * Class contains logic of bread crumb view in application.
 * @class BreadCrumbView
 * @extends View
 */
export default class CustomActionsView extends View {
  constructor(options) {
    super(options);

    this.schema = options.schema;
    this.resourceId = options.resourceId;
  }

  get template() {
    return template;
  }

  get events() {
    return {
      'click [data-gohan="action"]': 'onActionClick'
    };
  }

  dialogForm(schema, formTitle, onsubmit, onhide) {
    this.dialog = new DialogView({
      app: this.app,
      formTitle,
      onsubmit,
      onhide,
      unformattedSchema: {},
      schema: this.schema.toFormJSON(schema),
      fields: schema.propertiesOrder || Object.keys(schema.properties)
    });
    this.dialog.render();
  }

  onActionClick(event) {
    const actionId = event.target.dataset.id;
    const action = this.collection[actionId];

    if (action.hasDialog()) {
      const schema = action.getDialogSchema();

      this.dialogForm(schema, `<h4>Custom Action ${action.get('title') || actionId}</h4>`, data => {
        action.callAction(this.schema.apiEndpoint(), this.resourceId, data).then(response => {
          this.dialog.close();
          BootstrapDialog.show({
            type: BootstrapDialog.TYPE_DEFAULT,
            title: 'Success',
            message: JSON.stringify(response)
          });
        }).catch(error => {
          this.dialog.close();
          BootstrapDialog.show({
            type: BootstrapDialog.TYPE_DEFAULT,
            title: 'Error',
            message: error
          });
        });
      });
    } else {
      action.callAction(this.schema.apiEndpoint(), this.resourceId).then(response => {
        BootstrapDialog.show({
          type: BootstrapDialog.TYPE_SUCCESS,
          title: 'Success',
          message: response
        });
      }).catch(error => {
        BootstrapDialog.show({
          type: BootstrapDialog.TYPE_DANGER,
          title: 'Error',
          message: error
        });
      });
    }
  }

  /**
   * Renders component content.
   * @override View.render
   * @returns {BreadCrumbView}
   */
  render() {
    const actionsNames = [];

    for (let key in this.collection) {
      if (this.collection.hasOwnProperty(key)) {
        actionsNames.push(key);
      }
    }


    this.$el.html(this.template({
      actionsNames
    }));
    return this;
  }
}
