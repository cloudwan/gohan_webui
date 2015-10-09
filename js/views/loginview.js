Gohan.LoginView = Backbone.View.extend({
  tagName: 'div',
  events: {
    'click input.btn': 'login'
  },
  initialize: function(options) {
    this.model = options.model;
    this.listenTo(this.model, 'change:auth_data', this.reload);
  },
  reload: function(e) {
    Backbone.history.loadUrl(Backbone.history.fragment);
  },
  render: function() {
    this.$el.html(JST['login.html']({
      tenant_name: $.cookie('tenant_name')
    }));
    return this;
  },
  login: function(e) {
    e.preventDefault();
    var id = this.$('#id').val();
    var password = this.$('#password').val();
    var tenant = this.$('#tenant').val();
    $("#alerts").empty();
    this.model.saveAuth(id, password, tenant);
  }
});
