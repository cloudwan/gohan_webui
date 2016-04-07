import {Model} from 'backbone';
import cookie from 'js-cookie';

/**
 * Class contains logic of user authority in application.
 * @class UserModel
 * @extends Model
 */
export default class UserModel extends Model {
  defaults() {
    return {
      authData: undefined
    };
  }

  /**
   * Constructs the object.
   * @constructor
   * @extends Model.constructor
   * @param {Object} options
   */
  constructor(options) {
    super(options);
    this.url = options.url;
  }

  /**
   * Calls setAuthData function.
   * @override Model.parse
   * @param {Object} data
   */
  parse(data) {
    this.setAuthData(data);
  }

  /**
   * Syncs model data.
   * @extends Model.sync
   * @param {string} method
   * @param {Object} model
   * @param {Object} options
   */
  sync(method, model, options = {}) {
    options.headers = {
      'Content-Type': 'application/json'
    };
    super.sync(method, model, options);
  }

  /**
   * Saves authorisation data in server.
   * @param {string} id
   * @param {string} password
   * @param {String} tenant
   * @returns {Promise}
   */
  saveAuth(id, password, tenant) {
    return new Promise((resolve, reject) => {
      const authData = {
        auth: {
          passwordCredentials: {
            username: id,
            password
          },
          tenantName: tenant
        }
      };

      this.save(authData, {
        data: JSON.stringify(authData),
        success: (...params) => {
          resolve(params);
        },
        error: (...params) => {
          reject(params);
        }
      });
    });
  }

  /**
   * Saves data in cookie storage,
   * if parameter is undefined removes cookies.
   * @param {Object} data
   */
  setAuthData(data) {
    const MAX_COOKIE_LENGTH = 2000;

    if (data !== undefined) {
      const token = data.access.token.id;
      const tenantName = data.access.token.tenant.name;
      const userName = data.access.user.name;

      cookie.set('tenantName', tenantName);
      cookie.set('userName', userName);
      cookie.set('authData1', token.slice(0, MAX_COOKIE_LENGTH));
      cookie.set('authData2', token.slice(MAX_COOKIE_LENGTH));
      this.set('authData', data);
    } else {
      cookie.remove('authData1');
      cookie.remove('authData2');
    }
  }

  /**
   * Returns authority token.
   * @returns {string}
   */
  authToken() {
    if (cookie.get('authData1') === undefined ||
      cookie.get('authData2') === undefined) {
      return '';
    }
    return cookie.get('authData1') + cookie.get('authData2');
  }

  /**
   * Returns tenant name.
   * @returns {string}
   */
  tenantName() {
    return cookie.get('tenantName');
  }

  /**
   * Returns user name.
   * @returns {string}
   */
  userName() {
    return cookie.get('userName');
  }

  /**
   * Unsets authority data.
   */
  unsetAuthData() {
    this.setAuthData(undefined);
  }
}
