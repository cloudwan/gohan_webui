import {View} from 'backbone';

import template from './../../templates/sample.html';
import 'jquery';

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

    if (this.app) {
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
