'use strict';

const { isObject } = require('../../utilities');
const { throwPb } = require('../../errors');

const validateSpecific = function ({
  specific,
  protocolAdapter: { name: protocol },
}) {
  if (isObject(specific)) { return; }

  const message = `'specific' must be an object, not ${specific}`;
  throwPb({ message, reason: 'PROTOCOL', extra: { adapter: protocol } });
};

const validateString = function (value, name, protocolAdapter) {
  if (typeof value === 'string') { return; }

  throwProtocolError('a string', { value, name, protocolAdapter });
};

const validateObject = function (value, name, protocolAdapter) {
  if (isObject(value)) { return; }

  throwProtocolError('an object', { value, name, protocolAdapter });
};

const validateBoolean = function (value, name, protocolAdapter) {
  if (typeof value === 'boolean') { return; }

  throwProtocolError('a boolean', { value, name, protocolAdapter });
};

const throwProtocolError = function (type, { value, name, protocolAdapter }) {
  const message = `${name} must be ${type}, not ${JSON.stringify(value)}`;
  throwPb({
    message,
    reason: 'PROTOCOL',
    extra: { adapter: protocolAdapter.name },
  });
};

module.exports = {
  validateSpecific,
  validateString,
  validateObject,
  validateBoolean,
};
