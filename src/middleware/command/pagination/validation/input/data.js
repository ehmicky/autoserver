'use strict';

const { isEqual } = require('lodash');

const { throwError, addErrorHandler } = require('../../../../../error');
const { decode } = require('../../encoding');

// Returns arguments, after decoding tokens
const getInputData = function ({ args }) {
  validateInputData({ args });

  const decodedTokens = getDecodedTokens({ args });

  return Object.assign({}, args, ...decodedTokens);
};

const validateInputData = function ({ args }) {
  return validators.reduce((argsA, validator) => validator(argsA), args);
};

const validateSingleDirection = function (args) {
  const hasTwoDirections = args.before !== undefined &&
    args.after !== undefined;
  if (!hasTwoDirections) { return args; }

  const message = 'Wrong parameters: cannot specify both \'before\' and \'after\'';
  throwError(message, { reason: 'INPUT_VALIDATION' });

  return args;
};

const validateSingleType = function (args) {
  // Cannot mix offset-based pagination and cursor-based pagination
  const hasTwoPaginationTypes = args.page !== undefined &&
    (args.before !== undefined || args.after !== undefined);
  if (!hasTwoPaginationTypes) { return args; }

  const message = 'Wrong parameters: cannot use both \'page\' and \'before|after\'';
  throwError(message, { reason: 'INPUT_VALIDATION' });

  return args;
};

// Also, cannot specify 'filter' or 'nOrderBy' with a cursor, because the
// cursor already includes them.
const validateForbiddenArgs = function (args) {
  if (!hasCursor({ args })) { return args; }

  if (args.filter && !isEqual(args.filter, {})) {
    const message = 'Wrong parameters: cannot use both \'filter\' and \'before|after\'';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  if (args.nOrderBy !== undefined) {
    const message = 'Wrong parameters: cannot use both \'order_by\' and \'before|after\'';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }
};

const hasCursor = function ({ args }) {
  return (args.before !== undefined && args.before !== '') ||
    (args.after !== undefined && args.after !== '');
};

const validators = [
  validateSingleDirection,
  validateSingleType,
  validateForbiddenArgs,
];

const getDecodedTokens = function ({ args }) {
  const decodedTokens = ['before', 'after']
    .filter(name => args[name] !== undefined && args[name] !== '')
    .map(name => {
      const token = args[name];

      if (typeof token !== 'string') {
        const message = `Wrong parameters: '${name}' must be a string`;
        throwError(message, { reason: 'INPUT_VALIDATION' });
      }

      const decodedToken = eDecode({ token, name });
      return { [name]: decodedToken };
    });
  return decodedTokens;
};

const eDecode = addErrorHandler(decode, {
  message: ({ name }) => `Wrong parameters: '${name}' is invalid`,
  reason: 'INPUT_VALIDATION',
});

module.exports = {
  getInputData,
};
