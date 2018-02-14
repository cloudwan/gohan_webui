import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import {Observable} from 'rxjs';
import {
  getSingular,
  getCollection,
} from './../api';
import {
  getSchema,
  getSelectedParents,
} from './SchemaSelectors';

import {FETCH_SUCCESS, FETCH_ERROR} from './SchemaActionTypes';

function fetchSuccess(data) {
  return dispatch => {
    dispatch({data, type: FETCH_SUCCESS});
  };
}

function fetchError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: FETCH_ERROR, error});
  };
}

export function fetchSchema() {
  return (dispatch, getState) => {
    const state = getState();
    const url = state.configReducer.gohan.url + state.configReducer.gohan.schema;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };


    return axios.get(url, {headers}).then(response => {
      const schemas = response.data.schemas.map((schema, index, array) => {
        schema.children = array.filter(item => item.parent && item.parent === schema.id).map(item => item.id);
        return schema;
      });

      dispatch(fetchSuccess(schemas));
    }).catch(error => {
      console.log(error);
      dispatch(fetchError(error.response));
    });
  };
}

export function toLocalSchema(schema, state, parentProperty, uiSchema = {}) {
  return new Promise((resolve, reject) => {
    const result = cloneDeep(schema);

    result.nullable = false;

    if (Array.isArray(schema.type)) {
      if (schema.type.includes('null')) {
        result.nullable = true;
      }
      result.type = result.type[0];
    }

    if (result.relation !== undefined && result.relation !== parentProperty) {
      const relatedSchema = getSchema(state, result.relation);
      if (relatedSchema === undefined) {
        reject({data: `Cannot find "${result.relation}" related schema!`});
      }
      const query = {
        limit: 0,
        _fields: [
          'id',
          'name',
          ...(uiSchema['ui:customLabel'] ? [`${relatedSchema.parent}_id`] : [])
        ],
        ...uiSchema['ui:query']
      };

      getCollection(state, result.relation, {}, query)
        .subscribe(response => {
          const data = response.payload;
          const enumValues = [];
          const options = {};

          if (uiSchema['ui:customLabel']) {
            const [
              resource,
              separator,
              schemaId
            ] = uiSchema['ui:customLabel'].match(/(?!%)(.*?)(?=%)/g);
            const [
              resourceSchemaId,
              resourceProperty
            ] = resource.split('.');

            const parents = getSelectedParents(state, schemaId, resourceSchemaId)
              .reverse()
              .map(parent => parent.id);

            const makeRequest = (id, parent) => getSingular(
              state,
              parent,
              {[`${parent}_id`]: id},
              {limit: 0}
            );

            let request$;
            parents.forEach(parent => {
              if (request$ === undefined) {
                request$ = Observable.zip(
                  ...data.map(item => makeRequest(item[`${parent}_id`], parent))
                );
               } else {
                  request$ = request$.mergeMap(response => {
                    const ids = response.map(d => d.payload[`${parent}_id`]);
                    return Observable.zip(
                      ...ids.map(id => makeRequest(id, parent))
                    );
                  });
                }
              });

              request$.subscribe(response => {
                data.forEach((value, index) => {
                  enumValues.push(value.id);
                  const label = `${response[index].payload[resourceProperty]}${separator}${value.name}`;
                  options[value.id] = label || value.id;
                });

                result.enum = enumValues;
                result.options = options;
                resolve(result);
              }, error => {
                reject(error);
              });
          } else {
            data.forEach(value => {
              enumValues.push(value.id);
              options[value.id] = value.name || value.id;
            });

            result.enum = enumValues;
            result.options = options;
            resolve(result);
          }
        }, error => {
          reject(error);
        });
    } else if (result.type === 'array') {
      const promise = toLocalSchema(result.items, state, parentProperty, uiSchema);

      promise.then(data => {
        result.items = data;
        resolve(result);
      }, error => reject(error));
    } else if (result.type !== 'object') {
      resolve(result);
    } else if (result.properties !== undefined) {

      const promises = [];

      for (let key in result.properties) {
        const promise = toLocalSchema(result.properties[key], state, parentProperty, uiSchema[key]);
        promises.push(promise);
        promise.then(data => {
          result.properties[key] = data;
        }, error => reject(error));
      }
      Promise.all(promises).then(() => {
        resolve(result);
      }, data => {
        reject(data);
      });
    } else if (result.items !== undefined) {
      result.type = 'array';

      toLocalSchema(result.items, state, parentProperty).then(items => {
        if (items.title === undefined) {
          items.title = 'value';
          items.type = 'object';
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
      resolve({
        ...result,
        format: 'yaml',
        originalType: 'object',
        type: 'string'
      });
    }
  });
}

export function filterSchema(schema, action, parentProperty) {
  let result = {};

  if (schema.enum !== undefined ||
    schema.options !== undefined ||
    schema.properties === undefined) {
    return schema;
  }

  for (let key in schema.properties) {
    const property = schema.properties[key];

    if (key === 'id' && property.format === 'uuid') {
      continue;
    }

    if (parentProperty && key === `${parentProperty}_id`) {
      continue;
    }

    const view = property.view;

    if (view) {
      if (view.indexOf(action) < 0) {
        continue;
      }
    }

    if (property.permission === null ||
      property.permission === undefined) {
      result[key] = property;
      if (property.type.indexOf('array') >= 0) {
        result[key].items = filterSchema(property.items, action, parentProperty);
      } else if (property.type.indexOf('object') >= 0) {
        result[key] = filterSchema(property, action, parentProperty);
      }
      continue;
    }
    if (property.permission && property.permission.indexOf(action) >= 0) {
      result[key] = property;
      if (property.type.indexOf('array') >= 0) {
        result[key].items = filterSchema(property.items, action, parentProperty);
      } else if (property.type.indexOf('object') >= 0) {
        result[key] = filterSchema(property, action, parentProperty);
      }
    }
  }
  let required = [];

  if (schema.required) {
    required = schema.required.filter(property => {
      return result.hasOwnProperty(property);
    });
  }

  const propertiesOrder = schema.propertiesOrder ?
    schema.propertiesOrder.filter(item => Object.keys(result).includes(item)) :
    Object.keys(result);

  result = Object.assign(
    {},
    schema,
    {
      type: 'object',
      properties: result,
      propertiesOrder,
      required
    }
  );

  return result;
}
