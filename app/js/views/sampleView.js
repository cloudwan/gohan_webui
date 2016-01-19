var template = require('./../../templates/sample.html');
var SampleView = Backbone.View.extend({
  tagName: 'div',
  className: 'sampleview',
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

module.exports = SampleView;
