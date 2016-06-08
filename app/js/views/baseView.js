import {View} from 'backbone';
import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';

/**
 * Base view class contains some important logic to render view using
 * react components.
 * @class BaseView
 * @extends View
 */
export default class BaseView extends View {
  /**
   * Returns a component.
   * @returns {null}
   */
  component() {
    return null;
  }

  /**
   * Renders a react component.
   * @returns {BaseView}
   */
  render() {
    ReactDOM.render(this.component(), this.el);
    return this;
  }

  /**
   * Removes react component.
   * @extends View.remove
   */
  remove() {
    super.remove();
    ReactDOM.unmountComponentAtNode(this.el);
  }
}
