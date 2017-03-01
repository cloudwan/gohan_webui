import Ajv from 'ajv';
import cidrFormat from './cidrFormat';
import macFormat from './macFormat';

const ajv = new Ajv({
  allErrors: true,
  formats: {
    cidr: cidrFormat,
    mac: macFormat
  }
});

export default ajv;
