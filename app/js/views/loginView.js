var template = require('./../../templates/login.html');
var ErrorView = require('./errorView');

var LoginView = Backbone.View.extend({
  tagName: 'div',
  events: {
    'click input.btn': 'login'
  },
  initialize: function initialize(options) {
    this.model = options.model;
    this.errorView = new ErrorView();
    this.listenTo(this.model, 'change:auth_data', this.reload);
  },
  reload: function reload() {
    Backbone.history.loadUrl(Backbone.history.fragment);
  },
  render: function render() {
    this.$el.html(template({
      tenantName: $.cookie('tenant_name')
    }));
    return this;
  },
  login: function login(e) {
    e.preventDefault();
    var id = this.$('#id').val();
    var password = this.$('#password').val();
    var tenant = this.$('#tenant').val();

    $('#alerts').empty();
    this.model.saveAuth(id, password, tenant, this.errorView.render);
  }
});

module.exports = LoginView;
