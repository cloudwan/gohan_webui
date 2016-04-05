/* global $ */
import {View, history} from 'backbone';

import SidebarItemView from './sidebarItemView';

/**
 * Class contains logic of sidebar view in application.
 * @class SidebarView
 * @extends View
 */
export default class SidebarView extends View {
  get tagName() {
    return 'ul';
  }
  get className() {
    return 'nav nav-sidebar';
  }

  /**
   * Constructs the object.
   * @constructor
   * @override View.constructor
   * @param {Object} options
   */
  constructor(options) {
    super(options);

    this.schemas = options.schemas;
    this.router = options.app.router;
    this.listenTo(this.collection, 'add', this.append);
    this.router.on('route', this.onRoute.bind(this));
  }

  /**
   * Handles on route event.
   * Selects item in menu, by url fragment.
   */
  onRoute() {
    const model = this.collection.where({path: '/' + history.getFragment()})[0];

    this.$('.active').removeClass('active');

    if (model === undefined) {
      return;
    }
    const index = this.collection.indexOf(model);

    $(this.$el.children()[index]).addClass('active');
  }

  /**
   * Appends model and create sidebar item.
   * @param {Model} model
   */
  append(model) {
    const itemView = (new SidebarItemView({
      model
    })).render();
    const index = this.collection.indexOf(model);

    if (index === 0) {
      this.$el.prepend(itemView.el);
    } else {
      itemView.$el.insertAfter(this.$el.children()[index - 1]);
    }
  }

  /**
   * Renders component content.
   * @override View.render
   * @returns {SidebarView}
   */
  render() {
    this.collection.each(function iterator(model) {
      this.append(model);
    }, this);
    return this;
  }
}
