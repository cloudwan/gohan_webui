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
      'click [data-gohan="login"]': 'login'
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

    this.template = options.template || template;
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
    this.el.innerHTML = this.template({});
    $('[data-gohan="error"]', this.el).append(this.errorView.el);
    return this;
  }

  /**
   * Handles of click event on login button.
   * @param {Event} event
   */
  login(event) {
    event.preventDefault();
    event.currentTarget.disabled = true;

    const id = this.$('#id').val();
    const password = this.$('#password').val();
    $('#alerts').empty();
    this.model.login(id, password).then(
      tenants => {
        const tenant = tenants[0].name;
        this.model.loginTenant(tenant).catch(error => {
          this.errorView.render(...error);
        });
      }
    ).catch(error => {
      this.errorView.render(...error);
      event.currentTarget.disabled = false;
    });
  }
}
