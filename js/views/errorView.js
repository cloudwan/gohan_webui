require('./../../jst/templates');

var ErrorView = Backbone.View.extend({
  tagName: 'div',

  initialize: function() {
    this.message = 'Unknown Error';
  },

  render: function(collection, response) {
    this.message = response.statusText;
    switch (response.status) {
      case 0:
        this.message = 'Server Connection failed';
        collection.unsetAuthData();
        break;
      case 400:
        this.message = 'Invalid input error:' + response.responseJSON.error.message;
        break;
      case 401:
        this.message = 'Unauthorized Error: please retry login';
        collection.unsetAuthData();
        break;
      case 404:
        this.message = 'Data Not Found';
        break;
      case 500:
        this.message = 'Server Side Error';
        break;
    }
    var html = JST['error.html']({
      message: this.message
    });
    if ($('#alerts_form').length > 0) {
      $('#alerts_form').html(html);
    } else {
      $('#alerts').html(html);
    }
  }
});

module.exports = ErrorView;
