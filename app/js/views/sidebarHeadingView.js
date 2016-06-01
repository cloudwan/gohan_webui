var template = require('./../../templates/sideviewheading.html');
var SidebarHeadingView = Backbone.View.extend({
  tagName: 'li',
  className: 'head',
  events: {
  },
  initialize: function initialize(options) {
    this.app = options.app;

    if (this.app) {
      this.app.breadCrumb.update([]);
    }
  },
  render: function render() {
    this.$el.html(template());
    return this;
  },
  close: function close() {
    this.remove();
  }
});

module.exports = SidebarHeadingView;
