/* global $ */
import {View, history} from 'backbone';

import ErrorView from './errorView';

import template from './../../templates/login.html';

export default class LoginView extends View {
  get tagName() {
    return 'div';
  }
  get events() {
    return {
      'click input.btn': 'login'
    };
  }

  /**
   * Constructs the object.
   * @constructor
   * @extends View.constructor
   * @param {Object} options
   */
  constructor(options) {
    super(options);

    this.model = options.model;
    this.errorView = new ErrorView();
    this.listenTo(this.model, 'change:authData', this.reload);
  }

  /**
   * Reloads window on current history fragment.
   */
  reload() {
    history.loadUrl(history.fragment);
  }

  /**
   * Renders template to html element.
   * @returns {LoginView}
   */
  render() {
    this.el.innerHTML = template({
      tenantName: this.model.tenantName()
    });
    return this;
  }

  /**
   * Handles of click event on login button.
   * @param {Event} event
   */
  login(event) {
    event.preventDefault();
    const id = this.$('#id').val();
    const password = this.$('#password').val();
    const tenant = this.$('#tenant').val();

    $('#alerts').empty();
    this.model.saveAuth(id, password, tenant).catch(error => {
      this.errorView.render(...error);
    });
  }
}
