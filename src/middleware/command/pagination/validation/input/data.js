'use strict';

const { EngineError } = require('../../../../../error');
const { decode } = require('../../encoding');

// Returns arguments, after decoding tokens
const getInputData = function ({ args }) {
  const inputData = Object.assign({}, args);

  const hasTwoDirections = inputData.before !== undefined &&
    inputData.after !== undefined;

  if (hasTwoDirections) {
    const message = 'Wrong parameters: cannot specify both \'before\' and \'after\'';
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  // Cannot mix offset-based pagination and cursor-based pagination
  const hasTwoPaginationTypes = inputData.page !== undefined &&
    (inputData.before !== undefined || inputData.after !== undefined);

  if (hasTwoPaginationTypes) {
    const message = 'Wrong parameters: cannot use both \'page\' and \'before|after\'';
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  // Also, cannot specify 'nFilter' or 'nOrderBy' with a cursor, because the
  // cursor already includes them.
  for (const forbiddenArg of ['nFilter', 'nOrderBy']) {
    const hasForbiddenArg = inputData[forbiddenArg] !== undefined &&
      ((inputData.before !== undefined && inputData.before !== '') ||
      (inputData.after !== undefined && inputData.after !== ''));

    if (hasForbiddenArg) {
      const message = `Wrong parameters: cannot use both '${forbiddenArg}' and 'before|after'`;
      throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
    }
  }

  const decodedTokens = ['before', 'after']
    .filter(name => inputData[name] !== undefined && inputData[name] !== '')
    .map(name => {
      const token = inputData[name];

      if (typeof token !== 'string') {
        const message = `Wrong parameters: '${name}' must be a string`;
        throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
      }

      const decodedToken = getDecodedToken({ token, name });
      return { [name]: decodedToken };
    });
  Object.assign(inputData, ...decodedTokens);

  return inputData;
};

const getDecodedToken = function ({ token, name }) {
  try {
    return decode({ token });
  } catch (error) {
    const message = `Wrong parameters: '${name}' is invalid`;
    throw new EngineError(message, {
      reason: 'INPUT_VALIDATION',
      innererror: error,
    });
  }
};

module.exports = {
  getInputData,
};
