import {Validator} from 'jsonschema';
import {FORMAT_REGEXPS} from 'jsonschema/lib/helpers';
import Ajv from 'ajv';
import metaSchema from 'ajv/lib/refs/json-schema-draft-04.json';

import cidrFormat from './cidrFormat';
import macFormat from './macFormat';
import ipV6Format from './ipV6Format';
import ipV4Format from './ipV4Format';
import uuidFormat from './uuidFormat';
import emailFormat from './emailFormat';

// Override jsonschema built in regex.
FORMAT_REGEXPS.email = emailFormat;
FORMAT_REGEXPS.ipv4 = ipV4Format;
FORMAT_REGEXPS.ipv6 = ipV6Format;

// Custom jsonschema validators.
Validator.prototype.customFormats.mac = macFormat;
Validator.prototype.customFormats.cidr = cidrFormat;
Validator.prototype.customFormats.uuid = uuidFormat;

const ajv = new Ajv({
  meta: false,
  extendRefs: true,
  unknownFormats: 'ignore',
  allErrors: true,
  formats: {
    cidr: cidrFormat,
    mac: macFormat
  }
});

// https://github.com/epoberezkin/ajv/issues/471
ajv.addMetaSchema(metaSchema);
ajv._opts.defaultMeta = metaSchema.id;
ajv._refs['http://json-schema.org/schema'] = 'http://json-schema.org/draft-04/schema';
ajv.removeKeyword('propertyNames');
ajv.removeKeyword('contains');
ajv.removeKeyword('const');

export default ajv;
