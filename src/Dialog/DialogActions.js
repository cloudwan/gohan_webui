import axios from 'axios';
import {FETCH_SUCCESS, FETCH_FAILURE, CLEAR_DATA} from './DialogActionTypes';

function fetchSuccess(data) {
  return dispatch => {
    dispatch({data, type: FETCH_SUCCESS});
  };
}

function fetchError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: FETCH_FAILURE, error});
  };
}

function toLocalSchema(schema, state) {
  return new Promise((resolve, reject) => {
    const result = {...schema};
    if (Array.isArray(result.type)) {
      result.type = result.type[0];
    }

    if (result.relation !== undefined) {
      const enumValues = [];
      const options = {};
      const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': state.authReducer.tokenId
      };

      const relatedSchema = state.schemaReducer.data.find(item => item.id === result.relation);
      if (relatedSchema === undefined) {
        reject({data: 'Cannot find related schema!'});
      }

      axios.get(state.configReducer.gohan.url + relatedSchema.url, {headers}).then(response => {
        const data = response.data;

        for (let key in data) {
          data[key].forEach(value => {
            enumValues.push(value.id);
            options[value.id] = value.name;
          });
        }
        result.enum = enumValues;
        result.options = options;
        resolve(result);
      }).catch(error => {
        reject(error.response);
      });
    } else if (result.type === 'array') {
      const promise = toLocalSchema(result.items, state);

      promise.then(data => {
        result.items = data;
        resolve(result);
      });
    } else if (result.type !== 'object') {
      resolve(result);
    } else if (result.properties !== undefined) {

      const promises = [];

      for (let key in result.properties) {
        const promise = toLocalSchema(result.properties[key], state);
        promises.push(promise);
        promise.then(data => {
          result.properties[key] = data;
        });
      }
      Promise.all(promises).then(() => {
        resolve(result);
      }, data => {
        reject(data);
      });
    } else if (result.items !== undefined) {
      result.type = 'array';

      toLocalSchema(result.items, state).then(items => {
        if (items.title === undefined) {
          items.title = 'value';
        }
        result.items = {
          type: 'object',
          required: result.required,
          properties: {
            id: {
              title: 'key',
              type: 'string'
            },
            value: items
          }
        };
        resolve(result);
      }, error => {
        reject(error);
      });
    } else {
      result.format = 'yaml';
      result.originalType = 'object';
      resolve(result);
    }
  });
}

/**
 *
 * @param schema
 * @param action
 * @return {function(*, *)}
 */
export function fetchRelationFields(schema, action) {
  return async (dispatch, getState) => {
    const state = getState();

    try {
      const localSchema = await toLocalSchema(schema, state);
      let required = [];
      const propertiesOrder = [];

      const properties = localSchema.propertiesOrder.reduce((result, key) => {
        const property = localSchema.properties[key];

        if ((key === 'id' && property.format === 'uuid') ||
          property.permission === null ||
          property.permission === undefined ||
          (property.view && !property.view.includes(action))) {
          return result;
        }

        if (property.permission.includes(action)) {
          propertiesOrder.push(key);
          result[key] = property;
        }
        return result;
      }, {});

      if (localSchema.required !== null) {
        required = localSchema.required.filter(property => {
          return properties.hasOwnProperty(property);
        });
      }

      dispatch(fetchSuccess({
        type: 'object',
        properties,
        propertiesOrder,
        required
      }));
    } catch (error) {
      dispatch(fetchError(error));
    }
  };
}

export function clearData() {
  return dispatch => {
    dispatch({type: CLEAR_DATA});
  };
}
