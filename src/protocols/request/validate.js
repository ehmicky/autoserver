'use strict';

const { isObject } = require('../../utilities');
const { throwError } = require('../../errors');

const validateSpecific = function ({ specific }) {
  if (isObject(specific)) { return; }

  const message = `'specific' must be an object, not ${specific}`;
  throwError(message, { reason: 'PROTOCOL' });
};

const validateString = function (value, name) {
  if (typeof value === 'string') { return; }

  throwProtocolError('a string', { value, name });
};

const validateObject = function (value, name) {
  if (isObject(value)) { return; }

  throwProtocolError('an object', { value, name });
};

const validateBoolean = function (value, name) {
  if (typeof value === 'boolean') { return; }

  throwProtocolError('a boolean', { value, name });
};

const throwProtocolError = function (type, { value, name }) {
  const message = `${name} must be ${type}, not ${JSON.stringify(value)}`;
  throwError(message, { reason: 'PROTOCOL' });
};

module.exports = {
  validateSpecific,
  validateString,
  validateObject,
  validateBoolean,
};
