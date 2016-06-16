import {Collection} from 'backbone';
import SchemaModel from './schemaModel';

/**
 * Class contains logic of router in application.
 * @class AppRouter
 * @extends Router
 */
export default class SchemaCollection extends Collection {

  /**
   * Constructs the object.
   * @constructor
   * @override Collection.constructor
   * @param options
   */
  constructor(options) {
    super(options);

    this.model = SchemaModel;

    this.baseUrl = options.baseUrl;
    this.url = options.url;
    this.userModel = options.userModel;
    this.additionalForms = options.additionalForms;
    this.addingRelationDialog = options.addingRelationDialog;
    this.pageLimit = options.pageLimit;
  }

  /**
   * Parses data.
   * @override Collection.parse
   * @param {Object} resp
   * @returns {Object}
   */
  parse(resp) {
    return resp.schemas;
  }

  /**
   * Unsets auth data.
   */
  unsetAuthData() {
    this.userModel.unsetAuthData();
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
   * Syncs model data.
   * @extends Collection.sync
   * @param {string} method
   * @param {Object} collection
   * @param {Object} options
   */
  sync(method, collection, options = {}) {
    options.headers = {
      'X-Auth-Token': this.userModel.authToken(),
      'Content-Type': 'application/json'
    };
    super.sync(method, collection, options);
  }
}
