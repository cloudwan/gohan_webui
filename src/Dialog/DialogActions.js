import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import {
  OPEN,
  CLOSE,
  PREPARE_SUCCESS,
  PREPARE_FAILURE,
  ERROR,
  CLEAR_ERROR,
  CLEAR_DATA
} from './DialogActionTypes';

function fetchSuccess(data) {
  return dispatch => {
    dispatch({data, type: PREPARE_SUCCESS});
  };
}

function fetchError(data) {
  return dispatch => {
    const error = data.data;

    dispatch({type: PREPARE_FAILURE, error});
  };
}

function toLocalSchema(schema, state, parentProperty) {
  return new Promise((resolve, reject) => {
    const result = cloneDeep(schema);

    if (Array.isArray(schema.type)) {
      if (schema.type.includes('null')) {
        result.nullable = true;
      }
      result.type = result.type[0];
    }

    if (result.relation !== undefined && result.relation !== parentProperty) {
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
      const promise = toLocalSchema(result.items, state, parentProperty);

      promise.then(data => {
        result.items = data;
        resolve(result);
      });
    } else if (result.type !== 'object') {
      resolve(result);
    } else if (result.properties !== undefined) {

      const promises = [];

      for (let key in result.properties) {
        const promise = toLocalSchema(result.properties[key], state, parentProperty);
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
      result.format = 'yaml';
      result.originalType = 'object';
      resolve(result);
    }
  });
}

function filterSchema(schema, action, parentProperty) {
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

export function prepareSchema(schema, action, parentProperty) {
  return async (dispatch, getState) => {
    const state = getState();

    try {
      const resultSchema = await toLocalSchema(schema, state, parentProperty);

      dispatch(fetchSuccess(filterSchema(resultSchema, action, parentProperty)));
    } catch (error) {
      console.error(error);
      dispatch(fetchError(error));
    }

  };
}

export function clearData() {
  return dispatch => {
    dispatch({type: CLEAR_DATA});
  };
}

export const openDialog = name => () => dispatch => dispatch(
  {
    type: OPEN,
    name
  }
);

export const closeDialog = name => () => dispatch => dispatch(
  {
    type: CLOSE,
    name
  }
);

export const clearError = () => dispatch => dispatch(
  {
    type: CLEAR_ERROR,
  }
);

export const showError = message => dispatch => dispatch(
  {
    type: ERROR,
    message,
  }
);
