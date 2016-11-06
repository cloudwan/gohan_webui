import {View} from 'backbone';

import template from '../../templates/breadcrumb.html';

/**
 * Class contains logic of bread crumb view in application.
 * @class BreadCrumbView
 * @extends View
 */
export default class BreadCrumbView extends View {
  get className() {
    return 'bread-crumb';
  }

  get template() {
    return template;
  }

  /**
   * Updates bread crumb.
   * @param {Array} ancestors
   * @param {Object} childView
   */
  update(parents) {
    this.$el.html(this.template({parents}));
  }

  /**
   * Renders component content.
   * @override View.render
   * @returns {BreadCrumbView}
   */
  render() {
    this.$el.html();
    return this;
  }
}
