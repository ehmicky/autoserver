'use strict';

const { throwError } = require('../../error');

// Validate protocol handler is correctly working
const validateProtocolString = function (obj) {
  const { name, value } = parseSimpleObject({ obj });

  if (typeof value === 'string') { return; }

  const message = `'${name}' must be a string, not ${JSON.stringify(value)}`;
  throwError(message, { reason: 'ENGINE' });
};

const validateProtocolObject = function (obj) {
  const { name, value } = parseSimpleObject({ obj });

  if (value && value.constructor === Object) { return; }

  const message = `'${name}' must be an object, not ${JSON.stringify(value)}`;
  throwError(message, { reason: 'ENGINE' });
};

// Parse input when it is an object with a single key
const parseSimpleObject = function ({ obj }) {
  const [name] = Object.keys(obj);
  const { [name]: value } = obj;
  return { name, value };
};

module.exports = {
  validateProtocolString,
  validateProtocolObject,
};
