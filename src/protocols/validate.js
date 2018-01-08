'use strict';

const { isObject } = require('../utilities');
const { throwError } = require('../errors');
const { getLimits } = require('../limits');

const { METHODS } = require('./constants');

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
  const message = `'${name}()' must return ${type}, not ${JSON.stringify(value)}`;
  throwError(message, { reason: 'PROTOCOL' });
};

const validateMethod = function (method, name) {
  validateString(method, name);

  if (method === undefined || METHODS.includes(method)) { return; }

  const message = `Protocol method '${method}' is not allowed`;
  throwError(message, { reason: 'WRONG_METHOD', extra: { allowed: METHODS } });
};

const validateUrl = function (url, name, { config }) {
  validateString(url, name);

  const { maxUrlLength } = getLimits({ config });
  if (url.length <= maxUrlLength) { return; }

  const message = `URL length must be less than ${maxUrlLength} characters`;
  throwError(message, { reason: 'URL_LIMIT' });
};

// Validate protocol adapter functions are correctly working
// Also does some input validation
const VALIDATORS = {
  getIp: validateString,
  getHeaders: validateObject,
  getMethod: validateMethod,
  getOrigin: validateString,
  getUrl: validateUrl,
  getPath: validateString,
  getQueryString: validateString,
  hasPayload: validateBoolean,
};

module.exports = {
  VALIDATORS,
};
