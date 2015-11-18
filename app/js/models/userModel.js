require('jquery.cookie');

var UserModel = Backbone.Model.extend({
  defaults: {
    authData: undefined
  },
  initialize: function initialize(options) {
    this.url = options.url;
  },
  parse: function parse(data) {
    this.setAuthData(data);
  },
  sync: function sync(method, model, options) {
    if (_.isUndefined(options)) {
      options = {};
    }

    options.headers = {
      'Content-Type':'application/json'
    };
    Backbone.sync(method, model, options);
  },
  saveAuth: function saveAuth(id, password, tenant, errorCB) {
    var authData = {
      auth: {
        passwordCredentials: {
          username: id,
          password: password
        },
        tenantName: tenant
      }
    };

    this.save(authData, {
       wait: true,
       data: JSON.stringify(authData),
       error: errorCB
    });
  },
  setAuthData: function setAuthData(data) {
    var MAX_COOKIE_LENGTH = 2000;

    if (!_.isUndefined(data)) {
      var token = data.access.token.id;
      var tenantName = data.access.token.tenant.name;
      var userName = data.access.user.name;

      $.cookie('tenant_name', tenantName);
      $.cookie('user_name', userName);
      $.cookie('auth_data1', token.slice(0, MAX_COOKIE_LENGTH));
      $.cookie('auth_data2', token.slice(MAX_COOKIE_LENGTH));
      this.set('auth_data', data);
    } else {
      $.removeCookie('auth_data1');
      $.removeCookie('auth_data2');
    }
  },
  authToken: function authToken() {
    if (_.isUndefined($.cookie('auth_data1'))) {
      return false;
    }
    return $.cookie('auth_data1') + $.cookie('auth_data2');
  },
  tenantName: function tenantName() {
    return $.cookie('tenant_name');
  },
  userName: function userName() {
    return $.cookie('user_name');
  },
  unsetAuthData: function unsetAuthData() {
    this.setAuthData(undefined);
  }
});

module.exports = UserModel;
