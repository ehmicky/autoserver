'use strict';

const { validate } = require('../../../../validation');
const { EngineError } = require('../../../../error');
const { allowFullPagination, mustPaginateOutput } = require('../condition');
const { decode } = require('../encoding');

// Validate args.before|after|pageSize|page
const validatePaginationInput = function ({
  args,
  action,
  command,
  modelName,
  maxPageSize,
}) {
  const schema = getSchema({ args, command, maxPageSize });
  const data = getInputData({ args });
  const reportInfo = {
    type: 'paginationInput',
    action,
    modelName,
    dataVar: 'arguments',
  };
  validate({ schema, data, reportInfo });
};

const getSchema = function ({ args, command, maxPageSize }) {
  if (allowFullPagination({ args, command })) {
    return getFullSchema({ maxPageSize });
  }

  if (mustPaginateOutput({ args })) {
    return getLimitedSchema({ maxPageSize });
  }

  return restrictedSchema;
};

// JSON schema when consumers can specify args.before|after|pageSize|page
const getFullSchema = function ({ maxPageSize }) {
  return {
    type: 'object',

    properties: {
      before: parsedToken,
      after: parsedToken,

      pageSize: {
        type: 'integer',
        minimum: 1,
        maximum: maxPageSize,
      },

      page: {
        type: 'integer',
        minimum: 1,
      },
    },
  };
};

const parsedToken = {
  oneOf: [
    {
      type: 'string',
      const: '',
    },
    {
      type: 'object',
      required: ['nOrderBy', 'nFilter', 'parts'],
      properties: {
        parts: {
          type: 'array',
          minLength: 1,
        },
        nOrderBy: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              attrName: {
                type: 'string',
              },
              order: {
                enum: ['asc', 'desc'],
              },
            },
          },
        },
        nFilter: {
          type: 'string',
        },
      },
    },
  ],
};

// JSON schema when consumers can only specify args.pageSize
const getLimitedSchema = function ({ maxPageSize }) {
  return {
    type: 'object',

    properties: {
      pageSize: {
        type: 'integer',
        minimum: 1,
        maximum: maxPageSize,
      },
    },

    not: {
      anyOf: [
        { required: ['before'] },
        { required: ['after'] },
        { required: ['page'] },
      ],
    },
  };
};

// JSON schema when consumers cannot specify any pagination-related argument
const restrictedSchema = {
  not: {
    anyOf: [
      { required: ['before'] },
      { required: ['after'] },
      { required: ['page'] },
      { required: ['pageSize'] },
    ],
  },
};

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
  validatePaginationInput,
};
