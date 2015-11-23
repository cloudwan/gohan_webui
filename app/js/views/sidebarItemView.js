var templates = require('./../../jst/templates');

var SidebarItemView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click a': function onClickA(e) {
      e.preventDefault();
      Backbone.history.navigate(this.model.get('path'), true);
    }
  },
  initialize: function initialize() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'remove', this.remove);
    this.$el.addClass('withripple');
    this.$el.addClass(this.model.get('class'));
  },
  // View methods
  // ------------
  render: function render() {
    this.$el.html(templates.sideviewItem({
      source: this.model.toJSON()
    }));
    return this;
  }
});

module.exports = SidebarItemView;
