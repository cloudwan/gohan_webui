import {safeLoad} from 'js-yaml';
import isEmpty from 'lodash/isEmpty';

export const toServerData = (schema, data) => {

  if (schema.nullable && (data === null || data === '')) {
    return null;
  }

  if (data === undefined || data === null) {
    return undefined;
  }

  if (schema.type === 'array') {
    return data.map(item => toServerData(schema.items, item));
  }

  if (schema.type !== 'object' && schema.originalType !== 'object') {
    return data;
  }

  if (schema.properties !== undefined) {
    const result = {};
    for (let key in schema.properties) {
      result[key] = toServerData(schema.properties[key], data[key]);
    }
    return result;
  } else if (schema.items !== undefined) {
    const result = {};

    for (let d of data) {
      result[d.id] = toServerData(schema.items, d.value);
    }
    return result;
  }
  return safeLoad(data);
};

export const removeEmpty = obj => {
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return obj;
    }
    return obj.filter(f => !(f === undefined || ((f !== null && typeof f === 'object') && isEmpty(f))))
      .reduce((r, i) => {
          if (i !== null && typeof i === 'object') {
            const value = removeEmpty(i);

            if (!((value !== null && typeof value === 'object') && isEmpty(value))) {
              return [...r, value];
            }
            return r;
          }
          return [...r, i];
        },
        []);
  }

  return Object.keys(obj)
    .filter(f => {
      const isEmptyObject = (obj[f] !== null && typeof obj[f] === 'object') && isEmpty(obj[f]);
      return !(obj[f] === undefined || (isEmptyObject && !Array.isArray(obj[f])));
    })
    .reduce(
      (r, i) =>
        obj[i] !== null && typeof obj[i] === 'object' ?
          {...r, [i]: removeEmpty(obj[i])} :
          {...r, [i]: obj[i]},
      {}
    );
};
