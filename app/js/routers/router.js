/* global document, window */
import {Router, history} from 'backbone';

/**
 * Class contains logic of router in application.
 * @class AppRouter
 * @extends Router
 */
export default class AppRouter extends Router {

  /**
   * Constructs the object.
   * @constructor
   * @override
   * @param {Object} options={}
   */
  constructor(options = {}) {
    super(options);

    this.pageBaseTitle = options.title || '';
    this.routes = [];

    window.addEventListener('popstate', () => {
      this.navigate(window.location.hash, {trigger: true, replace: true});
    });
  }

  /**
   * Adds route to router.
   * @override
   * @param {string} route
   * @param {string} name
   * @param {!*} rest
   */
  route(route, name, ...rest) {
    this.routes.push({
      path: route,
      name
    });
    super.route(route, name, ...rest);
  }

  /**
   * Changes title to specified value.
   * @param {string} name=''
   */
  changeTitle(name = '') {
    if (name !== '') {
      document.title = name + ' | ' + this.pageBaseTitle;
      return;
    }
    document.title = this.pageBaseTitle;
  }

  setQueryParams(params) {
    let queryStrings = '';

    for (let x in params) {
      if (params.hasOwnProperty(x)) {
        if (queryStrings === '') {
          queryStrings += '?';
        } else {
          queryStrings += '&';
        }
        queryStrings += x + '=' + params[x];
      }
    }
    window.history.replaceState({}, '', `${window.location.pathname}${queryStrings}${window.location.hash}`);
  }

  getQueryParams() {
    const params = {};
    const queryStrings = history.location.search.substr(1);

    if (queryStrings === '') {
      return params;
    }

    queryStrings.split('&').map(query => {
      const keyvalue = query.split('=');

      params[keyvalue[0].toString()] = keyvalue[1].toString();
    });

    return params;
  }

  /**
   * Returns status of path in router,
   * if is registered returns true, otherwise false.
   * @param param
   * @returns {boolean}
   */
  pathIsRegistered(param) {
    return this.routes.map(({path}) => path).includes(param);
  }
}
