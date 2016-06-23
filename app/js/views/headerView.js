/* global window, $ */
import {View} from 'backbone';

import template from './../../templates/header.html';

/**
 * Class contains logic of header view in application.
 * @class HeaderView
 * @extends View
 */
export default class HeaderView extends View {
  get tagName() {
    return 'div';
  }
  get events() {
    return {
      'click [data-gohan="logout"]': 'logout',
      'click [data-gohan="change-tenant"]': 'changeTenant'
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
    this.config = options.config;
  }

  /**
   * Logs out user and reloads page.
   */
  logout() {
    this.model.unsetAuthData();
    window.location.reload();
  }

  /**
   * Change Tenant
   */
  changeTenant(event) {
    const tenant = $(event.currentTarget).data('tenant');
    this.model.loginTenant(tenant).then(
      () => {
        window.location.reload();
      }
    );
  }

  /**
   * Renders component content.
   * @override View.render
   * @returns {HeaderView}
   */
  render() {
    this.$el.html(template({
      config: this.config,
      username: this.model.userName(),
      authToken: this.model.authToken(),
      tenantName: this.model.tenantName(),
      tenants: this.model.tenants()
    }));
    return this;
  }
}
