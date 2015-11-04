Gohan.HeaderView = Backbone.View.extend({
  tagName: 'div',
  events: {
    'click #logout': 'logout',
  },
  className: 'container-fluid',
  initialize: function(options) {
    this.config = options.config;
    this.listenTo(this.model, 'change:auth_data', this.render);
  },
  logout: function() {
    console.log('click!');
    this.model.unsetAuthData();
    window.location.reload();
  },
  render: function(e) {
    this.$el.html(JST['header.html']({
      config: this.config,
      username: this.model.userName(),
      auth_token: this.model.authToken(),
      tenant_name: this.model.tenantName()
    }));
    return this;
  },
  noaction: function(e) {
    e.preventDefault();
  }
});
