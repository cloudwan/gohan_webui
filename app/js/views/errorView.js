/* global window */
import {View} from 'backbone';

import template from './../../templates/error.html';

export default class ErrorView extends View {
  get tagName() {
    return 'div';
  }

  get events() {
    return {
      'click [data-gohan="reload"]': 'reload',
      'click [data-gohan="close"]': 'close'
    };
  }

  constructor() {
    super();
    this.message = 'Unknown Error';
  }
  reload() {
    window.location.reload();
  }
  render(collection, response) {
    if (response === undefined) {
      return;
    }

    this.message = response.statusText;

    switch (response.status) {
      case 0: {
        this.message = 'Server Connection failed <a data-gohan="reload">Refresh</a>';
        break;
      }
      case 400: {
        this.message = 'Invalid input error:' + response.responseJSON.error;
        break;
      }
      case 401: {
        this.message = 'Unauthorized Error: please retry login <a data-gohan="reload">Refresh</a>';
        collection.unsetAuthData();
        break;
      }
      case 404: {
        this.message = 'Data Not Found';
        break;
      }
      case 500: {
        this.message = 'Server Side Error';
        break;
      }
    }
    const html = template({
      message: this.message
    });


    this.$el.html(html);
    return this;
  }

  close() {
    this.$el.html('<div></div>');
  }
}
