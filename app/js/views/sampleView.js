var SampleView = Backbone.View.extend({
  tagName: 'div',
  className: 'sampleview',
  events: {
  },

  initialize: function initialize() {
  },
  render: function render() {
    return this;
  },
  close: function close() {
    this.remove();
  }
});

module.exports = SampleView;
