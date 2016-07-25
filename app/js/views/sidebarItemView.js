import {View} from 'backbone';

import sideviewItemTemplate from './../../templates/sideviewItem.html';

/**
 * Class contains logic of sidebar item view in application.
 * @class SidebarItemView
 * @extends View
 */
export default class SidebarItemView extends View {
  get tagName() {
    return 'li';
  }

  /**
   * Constructs the object.
   * @constructor
   * @override View.constructor
   * @param {Object} options
   */
  constructor(options) {
    super(options);

    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'remove', this.remove);
    this.$el.addClass('withripple');
    this.$el.addClass(this.model.get('class'));
  }

  /**
   * Renders component content.
   * @override View.render
   * @returns {SidebarItemView}
   */
  render() {
    this.$el.html(sideviewItemTemplate({
      source: this.model.toJSON()
    }));
    return this;
  }
}
