import _ from 'lodash';

export function optionsListObject(schema) {
  const result = [];
  const {options} = schema;

  for (let key in options) {
    result.push({
      label: options[key],
      value: key
    });
  }

  return result;
}

export function omitByRecursively(value, iteratee) {
  return _.isObject(value) ? _(value)
      .omitBy(iteratee)
      .mapValues(v => omitByRecursively(v, iteratee))
      .value() :
    value;
}

export function removeEmptyObjects(obj) {
  return _(obj)
    .pickBy(_.isObject)
    .mapValues(removeEmptyObjects)
    .omitBy(_.isEmpty)
    .assign(_.omitBy(obj, _.isObject))
    .value();
}
