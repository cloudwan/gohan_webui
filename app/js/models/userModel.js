/* global sessionStorage */
import Backbone, {Model} from 'backbone';


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
    this.url = options.url + '/tokens';
    this.tenantURL = options.url + '/tenants';
  }

  /**
   * Calls setAuthData function.
   * @override Model.parse
   * @param {Object} data
   */
  parse(data) {
    this.saveScopedToken(data);
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
   * Login to the server
   * @param {string} id
   * @param {string} password
   * @returns {Promise}
   */
  login(id, password) {
    return new Promise( ( resolve, reject ) => {
      const authData = {
        auth: {
          passwordCredentials: {
            username: id,
            password
          }
        }
      };

      const tenants = this.tenants();
      if ( tenants ) {
        resolve( tenants );
        return;
      }
      Backbone.ajax( {
        dataType: 'json',
        url: this.url,
        data: JSON.stringify(authData),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        success: authToken => {
          this.saveUnscopedToken(authToken);
          this.fetchTenant(resolve, reject);
        },
        error: (...params) => {
          reject(params);
        }
      } );
    } );
  }
  /**
   * Fetch tenants from server
   */
  fetchTenant(resolve, reject) {
    Backbone.ajax( {
      method: 'GET',
      dataType: 'json',
      url: this.tenantURL,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': this.unscopedToken()
      },
      success: data => {
        const tenants = data.tenants;
        this.saveTenants(tenants);
        resolve(tenants);
      },
      error: ( ...params ) => {
        reject(params);
      }
    } );
  }

  /**
   * Login to the server with tenant.
   * @param {String} tenant
   * @returns {Promise}
   */
  loginTenant(tenant) {
    return new Promise( (resolve, reject) => {
      const authData = {
        auth: {
          token: {
            id: this.unscopedToken()
          },
          tenantName: tenant
        }
      };
      this.saveTenant(tenant);
      this.save(authData, {
        data: JSON.stringify( authData ),
        success: (...params) => {
          resolve(params);
        },
        error: (...params) => {
          reject(params);
        }
      } );
    } );
  }


  /**
   * Save item to sessionStorage
   * @param {Object} data
   */
  setItem(key, value) {
    sessionStorage.setItem( key, JSON.stringify( value ) );
  }

  /**
   * Get item to from sessionStorage
   * @param {Object} data
   */
  getItem(key) {
    const value = sessionStorage.getItem( key );
    if ( value ) {
      return JSON.parse( value );
    }
  }

  /**
   * Save unscoped token
   * @param {Object} data
   */
  saveUnscopedToken(data) {
    this.setItem('unscopedToken', data);
  }

  /**
   * Save tenants
   * @param {Object} data
   */
  saveTenants(data) {
    this.setItem('tenants', data);
  }

  /**
   * Save tenant selection
   * @param {Object} data
   */
  saveTenant(data) {
    this.setItem('tenant', data);
  }

  /**
   * Save scoped token
   * @param {Object} data
   */
  saveScopedToken(data) {
    const tenant = this.tenantName();
    let scopedToken = this.getItem( 'scopedToken' );
    if ( !scopedToken ) {
      scopedToken = {};
    }
    scopedToken[tenant] = data;
    this.setItem( 'scopedToken', scopedToken );
    this.set( 'authData', data );
  }

  /**
   * Reset auth data
   */
  unsetAuthData() {
    sessionStorage.removeItem( 'scopedToken' );
    sessionStorage.removeItem( 'unscopedToken' );
    sessionStorage.removeItem( 'tenant' );
    sessionStorage.removeItem( 'tenants' );
  }

  /**
   * Returns scoped token.
   * @returns {string}
   */
  authToken() {
    const tenant = this.tenantName();
    const scopedToken = this.getItem( 'scopedToken' );
    if ( scopedToken ) {
      const data = scopedToken[tenant];
      if ( data ) {
        return data.access.token.id;
      }
    }
  }

  /**
   * Returns unscoped token.
   * @returns {string}
   */
  unscopedToken() {
    const unscopedToken = this.getItem( 'unscopedToken' );
    if ( unscopedToken ) {
      return unscopedToken.access.token.id;
    }
  }

  /**
   * Returns tenant name.
   * @returns {string}
   */
  tenantName() {
    return this.getItem( 'tenant' );
  }

  /**
   * Returns tenants.
   * @returns {Object}
   */
  tenants() {
    return this.getItem( 'tenants' );
  }

  /**
   * Returns user name.
   * @returns {string}
   */
  userName() {
    const tenant = this.tenantName();
    const scopedToken = this.getItem( 'scopedToken' );
    if ( scopedToken ) {
      const data = scopedToken[tenant];
      if ( data ) {
        return data.access.user.name;
      }
    }
  }
}
