/* global $ */
import {View, ajax} from 'backbone';
import template from './../../templates/top.html';
import BootstrapDialog from 'bootstrap-dialog';

/**
 * Class contains logic of sample page view in application.
 * @class SampleView
 * @extends View
 */
export default class TopView extends View {
  get tagName() {
    return 'div';
  }

  get className() {
    return 'top-view';
  }

  get events() {
    return {
      'click button.api-request': 'apiRequest',
      'click .api-list > li> a': 'setURL'
    };
  }

  /**
   * Constructs the object.
   * @constructor
   * @override View.constructor
   * @param {Object} options
   */
  constructor(options) {
    super(options);
    this.app = options.app;
    this.errorView = new this.app.ErrorClass();

    if (this.app) {
      this.app.breadCrumb.update([{
        url: '/',
        title: 'Home'
      }]);
    }
    this.render();
  }


  apiRequest(event) {
    event.preventDefault();
    const method = this.$('#HTTPmethod').val();
    const url = this.app.config.get('gohan').url + this.$('#api-url').val();
    const data = this.$('#request-data').val();

    ajax({
      dataType: 'json',
      url,
      data,
      method,
      timeout: 5000,
      headers: {
        'X-Auth-Token': this.app.userModel.authToken(),
        'Content-Type': 'application/json'
      },
      success: (...param) => {
        BootstrapDialog.show({
          type: BootstrapDialog.TYPE_DEFAULT,
          title: 'Success',
          message: 'see dettail in console'
        });
        console.log(param);
      },
      error: (...param) => {
        BootstrapDialog.show({
          type: BootstrapDialog.TYPE_DEFAULT,
          title: 'Error',
          message: 'see dettail in console'
        });
        console.log(param);
      }
    });
  }

  setURL(event) {
    event.preventDefault();
    $('#api-url', this.$el).val(event.target.innerText);
  }

  /**
   * Renders component content.
   * @override View.render
   * @returns {SampleView}
   */
  render() {
    this.app.router.changeTitle('Home');
    const schemaURL = [];

    this.app.schemas.each(schema => {
      const metadata = schema.get('metadata');
      if (metadata && metadata.type !== undefined) {
        return;
      }
      schemaURL.push(schema.get('url'));
    });

    this.$el.html(template({
      gohanURL: this.app.config.get('gohan').url,
      schemaURL
    }));
    $('[data-gohan="error"]', this.el).append(this.errorView.el);
    return this;
  }

  /**
   * Removes page content.
   */
  close() {
    this.remove();
  }
}
