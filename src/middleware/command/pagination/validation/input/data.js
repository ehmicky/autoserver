'use strict';

const { throwError } = require('../../../../../error');
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

const validateForbiddenArgs = function (args) {
  // Also, cannot specify 'nFilter' or 'nOrderBy' with a cursor, because the
  // cursor already includes them.
  return forbiddenArgs.reduce(
    (argsA, forbiddenArg) => validateForbiddenArg(argsA, forbiddenArg),
    args,
  );
};

const forbiddenArgs = ['nFilter', 'nOrderBy'];

const validateForbiddenArg = function (args, forbiddenArg) {
  const hasForbiddenArg = args[forbiddenArg] !== undefined &&
    ((args.before !== undefined && args.before !== '') ||
    (args.after !== undefined && args.after !== ''));

  if (hasForbiddenArg) {
    const message = `Wrong parameters: cannot use both '${forbiddenArg}' and 'before|after'`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return args;
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

      const decodedToken = getDecodedToken({ token, name });
      return { [name]: decodedToken };
    });
  return decodedTokens;
};

const getDecodedToken = function ({ token, name }) {
  try {
    return decode({ token });
  } catch (error) {
    const message = `Wrong parameters: '${name}' is invalid`;
    throwError(message, {
      reason: 'INPUT_VALIDATION',
      innererror: error,
    });
  }
};

module.exports = {
  getInputData,
};
