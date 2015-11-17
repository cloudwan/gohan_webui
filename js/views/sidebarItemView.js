require('./../../jst/templates');

var SidebarItemView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click a': function(e) {
      e.preventDefault();
      Backbone.history.navigate(this.model.get('path'), true);
    }
  },
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'remove', this.remove);
    this.$el.addClass('withripple');
    this.$el.addClass(this.model.get('class'));
  },
  // View methods
  // ------------
  render: function() {
    this.$el.html(JST['sideview_item.html']({
      source: this.model.toJSON()
    }));
    return this;
  }
});

module.exports = SidebarItemView;