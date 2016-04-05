import {View} from 'backbone';

import template from '../../templates/breadcrumb.html';

/**
 * Class contains logic of bread crumb view in application.
 * @class BreadCrumbView
 * @extends View
 */
export default class BreadCrumbView extends View {
  get tagName() {
    return 'div';
  }
  get template() {
    return template;
  }

  /**
   * Updates bread crumb.
   * @param {Array} ancestors
   * @param {Object} childView
   */
  update(ancestors, childView) {
    const parents = ancestors.map(ancestor => {
      const fragment = ancestor.schema.get('url');
      const modelFragment = ancestor.schema.get('url') + '/' + ancestor.get('id');
      let schemaFragment = fragment;

      if (ancestor.schema.hasParent() && childView) {
        schemaFragment = ancestor.schema.parent().get('url') +
          '/' + ancestor.parentId() + '/' + ancestor.schema.get('plural');
      }
      return {
        title: ancestor.get('name'),
        schemaTitle: ancestor.schema.get('title'),
        fragment: modelFragment,
        schemaFragment
      };
    });

    parents.reverse();
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
