import Backbone from 'backbone';
import 'backbone-forms';
import jsyaml from 'js-yaml';

Backbone.Form.validators.errMessages.ipv4 = 'The specified IP address has an invalid format.';
Backbone.Form.validators.errMessages.ipv6 = 'The specified IP address has an invalid format.';
Backbone.Form.validators.errMessages.ipv4mask = 'The specified IP mask has an invalid format.';
Backbone.Form.validators.errMessages.cidr = 'The specified CIDR has an invalid format.';
Backbone.Form.validators.errMessages.mac = 'The specified MAC address has an invalid format.';
Backbone.Form.validators.errMessages.uuid = 'The specified UUID has an invalid format.';
Backbone.Form.validators.errMessages.port = 'The specified port has an invalid format.';
Backbone.Form.validators.errMessages.hostname = 'The specified hostname has an invalid format.';
Backbone.Form.validators.errMessages.uri = 'The specified uri has an invalid format.';
Backbone.Form.validators.errMessages['cidr-or-ipv4'] = 'The specified CIDR or IP has an invalid format.';
Backbone.Form.validators.errMessages.yaml = 'The specified yaml has an invalid format.';


Backbone.Form.validators.ipv4 = function ipv4(options) {
  options = Object.assign({
    type: 'ipv4',
    message: this.errMessages.ipv4
  }, options);

  return value => {
    const validation = new RegExp(
      '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    ).test(value);

    options.value = value;

    if (!validation && value) {
      return {
        type: options.type,
        message: options.message
      };
    }
  };
};

Backbone.Form.validators.ipv6 = function ipv6(options) {
  options = Object.assign({
    type: 'ipv6',
    message: this.errMessages.ipv6
  }, options);

  return value => {
    const validation = new RegExp(
      '(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|' +
      '([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]' +
      '{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9' +
      'a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4' +
      '}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a' +
      '-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))'
    ).test(value);

    options.value = value;

    if (!validation && value) {
      const error = {
        type: options.type,
        message: options.message
      };

      return error;
    }
  };
};

Backbone.Form.validators.ipv4mask = function ipv4mask(options) {
  options = Object.assign({
    type: 'ipv4mask',
    message: this.errMessages.ipv4mask
  }, options);

  return value => {
    const validation = new RegExp('^\\d+$').test(value) && (value >= 1) && (value <= 32);

    options.value = value;

    if (!validation && value) {
      const error = {
        type: options.type,
        message: options.message
      };

      return error;
    }
  };
};

Backbone.Form.validators.cidr = function cidr(options) {
  const ipv4Validator = Backbone.Form.validators.ipv4(options);
  const ipv4MaskValidator = Backbone.Form.validators.ipv4mask(options);

  options = Object.assign({}, {
    type: 'cidr',
    message: this.errMessages.cidr
  }, options);

  return value => {
    const parts = value.split('/');
    const ip = parts[0];
    const mask = parts[1];
    const ipv4ValidatorError = ipv4Validator(ip);
    const ipv4MaskValidatorError = ipv4MaskValidator(mask);

    options.value = value;

    if (ipv4ValidatorError || ipv4MaskValidatorError) {
      const error = {
        type: options.type,
        message: options.message
      };
      return error;
    }
  };
};

Backbone.Form.validators.mac = function mac(options) {
  options = Object.assign({
    type: 'mac',
    message: this.errMessages.mac
  }, options);

  return value => {
    const validation = new RegExp('^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$').test(value);

    options.value = value;

    if (!validation && value) {
      const error = {
        type: options.type,
        message: options.message
      };

      return error;
    }
  };
};

Backbone.Form.validators.uuid = function uuid(options) {
  options = Object.assign({
    type: 'uuid',
    message: this.errMessages.uuid
  }, options);

  return value => {
    const formats = [
      /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[1-5][A-Fa-f0-9]{3}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/,
      /^[A-Fa-f0-9]{8}[A-Fa-f0-9]{4}[1-5][A-Fa-f0-9]{3}[A-Fa-f0-9]{4}[A-Fa-f0-9]{12}$/
    ];

    const validation = formats.some(regexp => {
      return regexp.test(value);
    });

    options.value = value;

    if (!validation && value) {
      const error = {
        type: options.type,
        message: options.message
      };

      return error;
    }
  };
};

Backbone.Form.validators.port = function port(options) {
  options = Object.assign({
    type: 'port',
    message: this.errMessages.port
  }, options);

  return value => {
    const validation = new RegExp('^\\d+$').test(value) && (value >= 1) && (value <= 65535);

    options.value = value;

    if (!validation && value) {
      const error = {
        type: options.type,
        message: options.message
      };

      return error;
    }
  };
};

Backbone.Form.validators.hostname = function hostname(options) {
  options = Object.assign({
    type: 'hostname',
    message: this.errMessages.hostname
  }, options);

  return value => {
    const validation = new RegExp(
        '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$'
      ).test(value);

    options.value = value;

    if (!validation && value) {
      const error = {
        type: options.type,
        message: options.message
      };

      return error;
    }
  };
};

Backbone.Form.validators.uri = function uri(options) {
  options = Object.assign({
    type: 'uri',
    message: this.errMessages.uri
  }, options);

  return value => {
    const validation = new RegExp(
        '([A-Za-z][A-Za-z0-9+\\-.]*):(?:(//)(?:((?:[A-Za-z0-9\\-._~!$&\'()*+,;=:]|%[0-9A-Fa-f]{2})*)@)?((?:\\[(?:(?:(' +
        '?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:' +
        '[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]' +
        '{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[' +
        '0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[0' +
        '1]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4' +
        '})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\\.[A-Za-z0-9\\-._~' +
        '!$&\'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]' +
        '?)|(?:[A-Za-z0-9\\-._~!$&\'()*+,;=]|%[0-9A-Fa-f]{2})*))(?::([0-9]*))?((?:/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]' +
        '|%[0-9A-Fa-f]{2})*)*)|/((?:(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&\'(' +
        ')*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._' +
        '~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)(?:\\?((?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?(?:\\' +
        '#((?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?'
    ).test(value);

    options.value = value;

    if (!validation && value) {
      const error = {
        type: options.type,
        message: options.message
      };

      return error;
    }
  };
};

Backbone.Form.validators['cidr-or-ipv4'] = function cidrOrIpv4(options) {
  const ipv4Validator = Backbone.Form.validators.ipv4(options);
  const ipv4MaskValidator = Backbone.Form.validators.ipv4mask(options);

  options = Object.assign({}, {
    type: 'cidr-or-ipv4',
    message: this.errMessages['cidr-or-ipv4']
  }, options);

  return value => {
    const parts = value.split('/');
    const ip = parts[0];
    const mask = parts[1];
    const ipv4ValidatorError = ipv4Validator(ip);
    const ipv4MaskValidatorError = ipv4MaskValidator(mask);

    options.value = value;

    if (!ipv4ValidatorError && parts.length === 1) {
      return;
    } else if (!(ipv4ValidatorError || ipv4MaskValidatorError) && parts.length === 2) {
      return;
    }

    const error = {
      type: options.type,
      message: options.message
    };
    return error;

  };
};

Backbone.Form.validators.yaml = function uri(options) {
  options = Object.assign({
    type: 'yaml',
    message: this.errMessages.yaml
  }, options);

  return value => {
    let validation;

    try {
      let object = jsyaml.load(value);

      if ((typeof object).toLowerCase() === 'object') {
        throw Error();
      }
    } catch (err) {
      validation = err;
    }

    options.value = value;

    if (!validation && value) {
      const error = {
        type: options.type,
        message: options.message
      };

      return error;
    }
  };
};
