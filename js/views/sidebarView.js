var SidebarItemView = require('./sidebarItemView');
var templates = require('./../../jst/templates');

var SidebarView = Backbone.View.extend({
  tagName: 'ul',
  className: 'document-row',
  initialize: function initialize(options) {
    this.schemas = options.schemas;
    this.listenTo(this.collection, 'add', this.append);
  },
  // View methods
  // ------------
  render: function render() {
    this.collection.each(function iterator(model) {
      this.append(model);
    }, this);
    return this;
  },
  append: function append(model) {
    var itemView = (new SidebarItemView({
      model: model
    })).render();
    var index = this.collection.indexOf(model);

    if (index === 0) {
      this.$el.prepend(itemView.el);
    } else {
      itemView.$el.insertAfter(this.$el.children()[index - 1]);
    }
  },
  select: function select(model) {
    this.$('.active').removeClass('active');

    if (model) {
      var index = this.collection.indexOf(model);

      $(this.$el.children()[index]).addClass('active');
    }
  }
});

module.exports = SidebarView;
