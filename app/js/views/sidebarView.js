/* global VERSION, $ */
import {View, history} from 'backbone';
import template from './../../templates/sidebar.html';



/**
 * Class contains logic of sidebar view in application.
 * @class SidebarView
 * @extends View
 */
export default class SidebarView extends View {
  get tagName() {
    return 'div';
  }

  get className() {
    return 'nav-sidebar';
  }

  get events() {
    return {
      'focus [data-gohan="menu-filter"]': 'onFilter',
      'blur [data-gohan="menu-filter"]': 'onFilter',
      'click [data-gohan="sidebar-open"]': 'openSidebar',
      'click [data-gohan="sidebar-close"]': 'closeSidebar'
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
    this.schemas = options.schemas;
    this.router = options.app.router;
    this.filterDelay = 300;
    this.filterTimeout = undefined;
    this.filterCache = '';
    this.listenTo(this.collection, 'sync', this.render);
    this.router.on('route', this.onRoute.bind(this));
  }

  /**
   * Handles on route event.
   * Selects item in menu, by url fragment.
   */
  onRoute() {
    const prevModel = this.collection.findWhere({active: true});
    const nextModel = this.collection.findWhere({path: '/' + history.getFragment()});

    if (prevModel !== undefined) {
      prevModel.set('active', false);
    }

    if (nextModel !== undefined) {
      nextModel.set('active', true);
    }
    this.closeSidebar();
    this.render();
  }

  /**
   * Handles on focus event for the filter input field.
   */
  onFilter(event) {
    if (event.type === 'focusin') {
      this.menuFilter();
    } else if (event.type === 'focusout') {
      clearTimeout(this.filterTimeout);
    }
  }

  /**
   * Handles each menu dom visibility as to input text.
   */
  menuFilter() {
    clearTimeout(this.filterTimeout);
    const value = $('.menu-filter', this.$el).val().toLowerCase();
    const $defaultMenu = $('.nav > li > a', this.$el);

    if (value !== '' && this.filterCache !== value) {
      $defaultMenu.hide();
      const $filteredMenu = $defaultMenu.filter(function () {
        return $(this).text().toLowerCase().includes(value);
      });

      $filteredMenu.show();
      this.filterCache = value;
    } else if (value === '' && this.filterCache !== value) {
      this.filterCache = '';
      $defaultMenu.show();
    }

    this.filterTimeout = setTimeout(() => {
      this.menuFilter();
    }, this.filterDelay);
  }

  /**
   * Handles sidebar visivility when screen size is smaller than sm.
   */
  openSidebar() {
    this.$el.parent().addClass('open');
  }

  /**
   * Handles sidebar visivility when screen size is smaller than sm.
   */
  closeSidebar() {
    this.$el.parent().removeClass('open');
  }

  /**
   * Renders component content.
   * @override View.render
   * @returns {SidebarView}
   */
  render() {
    this.$el.html(template({
      version: VERSION,
      defaultMenu: this.collection.toJSON()
    }));
    return this;
  }
}
