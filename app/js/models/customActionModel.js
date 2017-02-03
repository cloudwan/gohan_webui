/* globals fetch */
import 'whatwg-fetch';
import {Model} from 'backbone';

/**
 * Class contains logic of custom action.
 * @class customActionModel
 * @extends Model
 */
export default class CustomActionModel extends Model {

  /**
   * Constructs the object.
   * @constructor
   * @extends Model.constructor
   * @param options
   */
  constructor(options) {
    super(options.model);

    this.userModel = options.userModel;
  }

  hasDialog() {
    return Boolean(this.get('input'));
  }

  getDialogSchema() {
    return this.get('input');
  }

  callAction(endpoint, id, data,) {
    const method = this.get('method');
    const path = this.get('path');
    let url = `${endpoint}${path}`;

    url = url.replace(/:id/, id);

    return new Promise((resolve, reject) => {
      fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': this.userModel.authToken()
        },
      }).then(response => {
        if (response.ok) {
          response.text().then(data => resolve(data)).catch(error => reject(error));
        } else {
          reject(response.statusText);
          console.error(response.statusText);
        }
      }).catch(error => {
        reject(error);
        console.error(error);
      });
    });
  }
}
