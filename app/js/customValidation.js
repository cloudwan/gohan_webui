import ZSchema from 'z-schema';
import * as _ from 'underscore';

ZSchema.registerFormat('yaml', function yaml() {
  return true;
});

ZSchema.registerFormat('javascript', function javascript() {
  return true;
});

ZSchema.registerFormat('jsonschema', function jsonschema() {
  return true;
});

ZSchema.registerFormat('uuid', function uuid(str) {
  var formats = [
    /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[1-5][A-Fa-f0-9]{3}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/,
    /^[A-Fa-f0-9]{8}[A-Fa-f0-9]{4}[1-5][A-Fa-f0-9]{3}[A-Fa-f0-9]{4}[A-Fa-f0-9]{12}$/
  ];

  return _.any(formats, function check(regexp) {
    return regexp.test(str);
  });
});

ZSchema.registerFormat('text', function text() {
  return true;
});

ZSchema.registerFormat('mac', function mac(str) {
  return RegExp('^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$').test(str);
});

ZSchema.registerFormat('cidr', function cidr(str) {
  var parts = str.split('/');

  if (parts.length !== 2) {
    return false;
  }

  var address = parts[0];
  var mask = parts[1];
  var isIPv4 = function isIPv4(add) {
    return new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
      .test(add);
  };
  var isIPv4Mask = function isIPv4Mask(ip4Mask) {
    var value = parseInt(ip4Mask, 10);

    return RegExp('^\\d+$').test(ip4Mask) && (value >= 1) && (value <= 32);
  };

  return isIPv4(address) && isIPv4Mask(mask);
});

ZSchema.registerFormat('port', function port(str) {
  var value = parseInt(str, 10);

  return RegExp('^\\d+$').test(str) && (value >= 1) && (value <= 65535);
});
