/* global setTimeout */
import {View} from 'backbone';

import loaderTemplate from './../../templates/loader.html';
import template from './../../templates/sample.html';

/**
 * Class contains logic of sample page view in application.
 * @class SampleView
 * @extends View
 */
export default class SampleView extends View {
  get tagName() {
    return 'div';
  }
  get className() {
    return 'sampleview';
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

    this.$el.html(loaderTemplate());
    setTimeout(() => this.render(), 2000); // this was added for showing loading.

    if (this.app) {
      this.app.router.changeTitle('Home');
      this.app.breadCrumb.update([]);
    }
  }

  /**
   * Renders component content.
   * @override View.render
   * @returns {SampleView}
   */
  render() {
    this.$el.html(template());
    return this;
  }

  /**
   * Removes page content.
   */
  close() {
    this.remove();
  }
}
