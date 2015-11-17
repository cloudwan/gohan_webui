var SidebarItemView = require('./sidebarItemView');

require('./../../jst/templates');

var SidebarView = Backbone.View.extend({
  tagName: 'ul',
  className: 'document-row',
  initialize: function(options) {
    this.schemas = options.schemas;
    this.listenTo(this.collection, 'add', this.append);
  },
  // View methods
  // ------------
  render: function() {
    this.collection.each(function(model) {
      this.append(model);
    }, this);
    return this;
  },
  append: function(model) {
    var item_view = (new SidebarItemView({
      model: model
    })).render();
    var index = this.collection.indexOf(model);
    if (index === 0) {
      this.$el.prepend(item_view.el);
    } else {
      item_view.$el.insertAfter(this.$el.children()[index - 1]);
    }
  },
  select: function(model) {
    this.$('.active').removeClass('active');
    if (model) {
      var index = this.collection.indexOf(model);
      $(this.$el.children()[index]).addClass('active');
    }
  }
});

module.exports = SidebarView;
