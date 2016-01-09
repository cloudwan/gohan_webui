var template = require('./../../templates/header.html');

var HeaderView = Backbone.View.extend({
  tagName: 'div',
  events: {
    'click #logout': 'logout'
  },
  initialize: function initialize(options) {
    this.config = options.config;
    this.listenTo(this.model, 'change:auth_data', this.render);
  },
  logout: function logout() {
    console.log('click!');
    this.model.unsetAuthData();
    window.location.reload();
  },
  render: function render() {
    this.$el.html(template({
      config: this.config,
      username: this.model.userName(),
      authToken: this.model.authToken(),
      tenantName: this.model.tenantName()
    }));
    return this;
  },
  noaction: function noaction(e) {
    e.preventDefault();
  }
});

module.exports = HeaderView;
