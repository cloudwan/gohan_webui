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
