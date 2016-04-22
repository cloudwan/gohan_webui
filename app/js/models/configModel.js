/* global location */
import {Model} from 'backbone';

/**
 * Class contains logic of config in application.
 * @class ConfigModel
 * @extends Model
 */
export default class ConfigModel extends Model {

  /**
   * Constructs the object.
   * @constructor
   * @extends Model.constructor
   * @param options
   */
  constructor(options) {
    super(options);

    this.url = options.url;
  }

  /**
   * Fetches data from server.
   * @extends Collection.fetch
   * @param {Object} [options]
   * @returns {Promise}
   */
  fetch(options) {
    return new Promise((resolve, reject) => {
      super.fetch(Object.assign({
        success: (...params) => {
          resolve(params);
        },
        error: (...params) => {
          reject(params);
        }
      }, options));
    });
  }

  /**
   * Parses data.
   * @override Model.parse
   * @param {Object} resp
   * @returns {Object}
   */
  parse(resp) {
    if (resp.authUrl.indexOf('__HOST__') !== -1) {
      resp.authUrl = resp.authUrl.replace(
        '__HOST__', location.hostname);
    }

    if (resp.gohan.url.indexOf('__HOST__') !== -1) {
      resp.gohan.url = resp.gohan.url.replace(
        '__HOST__', location.hostname);
    }
    return resp;
  }
}
