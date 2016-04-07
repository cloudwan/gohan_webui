/* global window, $ */
import {View} from 'backbone';

import template from './../../templates/error.html';

export default class ErrorView extends View {
  get tagName() {
    return 'div';
  }
  constructor() {
    super();
    this.message = 'Unknown Error';
  }

  render(collection, response) {
    if (response === undefined) {
      window.location.reload();
      return;
    }

    this.message = response.statusText;

    switch (response.status) {
      case 0: {
        this.message = 'Server Connection failed';
        collection.unsetAuthData();
        window.location.reload();
        break;
      }
      case 400: {
        this.message = 'Invalid input error:' + response.responseJSON.error;
        break;
      }
      case 401: {
        this.message = 'Unauthorized Error: please retry login';
        collection.unsetAuthData();
        window.location.reload();
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

    if ($('#alerts_form').length > 0) {
      $('#alerts_form').html(html);
    } else {
      $('#alerts').html(html);
    }
  }
}
