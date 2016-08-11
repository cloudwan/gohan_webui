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
    this.messageDetail = '';
  }
  reload() {
    window.location.reload();
  }
  render(...params) {
    const response = params.find(param => {
      return param.hasOwnProperty('status') && param.hasOwnProperty('readyState');
    });

    if (response === undefined) {
      return;
    }

    this.message = response.statusText;
    if (response.hasOwnProperty('responseJSON') && response.responseJSON) {
      if (response.responseJSON.hasOwnProperty('error')) {
        if (typeof response.responseJSON.error === 'object' && response.responseJSON.error.message) {
          this.messageDetail = response.responseJSON.error.message;
        } else {
          this.messageDetail = response.responseJSON.error;
        }
      }
    }

    switch (response.status) {
      case 0: {
        this.message = 'Server Connection failed (<a href="#" data-gohan="reload" class="alert-link">Reload</a>)';
        break;
      }
      case 400: {
        this.message = 'Bad Request';
        break;
      }
      case 401: {
        this.message = 'Unauthorized Error';
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
      message: this.message,
      messageDetail: this.messageDetail
    });

    this.$el.html(html);
    this.delegateEvents();
    return this;
  }

  close() {
    this.$el.html('<div></div>');
  }
}
