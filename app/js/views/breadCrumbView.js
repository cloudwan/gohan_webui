import {View} from 'backbone';
import _ from 'underscore';
import defaultTemplate from '../../templates/breadcrumb.html';

/**
 * Class contains logic of bread crumb view in application.
 * @class BreadCrumbView
 * @extends View
 */
export default class BreadCrumbView extends View {
  get className() {
    return 'bread-crumb';
  }

  constructor(options = {}) {
    super(options);

    this.template = options.template || defaultTemplate;
  }

  /**
   * Updates bread crumb.
   * @param {Array} ancestors
   * @param {Object} childView
   */
  update(parents) {
    const parentsEscaped = parents.map(parent => {
      return {
        title: _.escape(parent.title),
        url: _.escape(parent.url)
      };
    });

    this.$el.html(this.template({
      parents: parentsEscaped
    }));
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
