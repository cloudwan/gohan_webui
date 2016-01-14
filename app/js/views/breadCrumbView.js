var template = require('../../templates/breadcrumb.html');

var BreadCrumbView = Backbone.View.extend({
  tagName: 'div',
  template: template,
  update: function update(ancestors, childView) {
    var parents = ancestors.map(function iterator(ancestor) {
      var fragment = ancestor.schema.get('url');
      var modelFragment = ancestor.schema.get('url') + '/' + ancestor.get('id');
      var schemaFragment = fragment;

      if (ancestor.schema.hasParent() && childView) {
        schemaFragment = ancestor.schema.parent().get('url') + '/' + ancestor.parentId()
          + '/' + ancestor.schema.get('plural');
      }
      return {
        title: ancestor.get('name'),
        schemaTitle: ancestor.schema.get('title'),
        fragment: modelFragment,
        schemaFragment: schemaFragment
      };
    });

    parents.reverse();
    this.$el.html(this.template({parents: parents}));
  },
  render: function render() {
    this.$el.html();
    return this;
  }
});

module.exports = BreadCrumbView;
