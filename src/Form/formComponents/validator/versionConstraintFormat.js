export default function versionContraintFormat(data) {
  const semVerFormat = new RegExp([
    /v?([0-9|x|X|*]+)(\.[0-9|x|X|*]+)?(\.[0-9|x|X|*]+)?/.source,
    /(-([0-9A-Za-z\-]+(\.[0-9A-Za-z\-]+)*))?/.source,
    /(\+([0-9A-Za-z\-]+(\.[0-9A-Za-z\-]+)*))?$/.source
    ].join('')
  );

  const constraints = [
    /=/, // eslint-disable-line no-div-regex
    /!=/,
    />/,
    /</,
    />=/,
    /=>/, // eslint-disable-line no-div-regex
    /=</, // eslint-disable-line no-div-regex
    /<=/,
    /~/,
    /~>/,
    /\^/
  ];

  if (!data) {
    return true;
  }

  return constraints.some(constraint => {
    return new RegExp('^' + constraint.source + '?' + semVerFormat.source).test(data);
  });
}
