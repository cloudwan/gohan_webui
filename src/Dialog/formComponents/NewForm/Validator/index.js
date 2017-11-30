import Ajv from 'ajv';

import cidrFormat from './cidrFormat';
import macFormat from './macFormat';
import ipV6Format from './ipV6Format';
import ipV4Format from './ipV4Format';
import uuidFormat from './uuidFormat';
import emailFormat from './emailFormat';

const ajv = new Ajv({
  allErrors: true,
  formats: {
    cidr: cidrFormat,
    mac: macFormat,
    email: emailFormat,
    uuid: uuidFormat,
    ipv4: ipV4Format,
    ipv6: ipV6Format
  },
});

export default ajv;
