'use strict';


const { allowFullPagination, mustPaginateOutput } = require('../condition');
const { getThrowError } = require('../throw_error');
const { decode } = require('../encoding');
const { validate } = require('../../../validation');


// Validate args.before|after|page_size|page
const validatePaginationInput = function ({ args, action, modelName, maxPageSize }) {
  const throwError = getThrowError({ action, modelName });

  let schema;
  if (allowFullPagination({ args, action })) {
    schema = getFullSchema({ args, maxPageSize });
  } else if (mustPaginateOutput({ args, action })) {
    schema = getLimitedSchema({ maxPageSize });
  } else {
    schema = restrictedSchema;
  }
  const data = getInputData({ throwError, args });

  validate({ schema, data, reportInfo: { type: 'paginationInput', action, modelName, dataVar: 'arguments' } });
};

// JSON schema when consumers can specify args.before|after|page_size|page
const getFullSchema = function ({ args: { orderBy, filter } = {}, maxPageSize }) {
  const parsedToken = {
    oneOf: [
      {
        type: 'string',
        const: '',
      },
      {
        type: 'object',
        required: ['orderBy', 'filter', 'parts'],
        properties: {
          parts: {
            type: 'array',
            minLength: 1,
          },
          orderBy: {
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
            const: orderBy,
          },
          filter: {
            type: 'string',
            const: filter,
          },
        },
      },
    ],
  };

  return {
    type: 'object',

    properties: {
      before: parsedToken,
      after: parsedToken,

      page_size: {
        type: 'integer',
        minimum: 0,
        maximum: maxPageSize,
      },

      page: {
        type: 'integer',
        minimum: 1,
      },
    },
  };
};

// JSON schema when consumers can only specify args.page_size
const getLimitedSchema = function ({ maxPageSize }) {
  return {
    type: 'object',

    properties: {
      page_size: {
        type: 'integer',
        minimum: 0,
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
      { required: ['page_size'] },
    ],
  },
};

// Returns arguments, after decoding tokens
const getInputData = function ({ throwError, args }) {
  const inputData = Object.assign({}, args);
  if (inputData.before !== undefined && inputData.after !== undefined) {
    throwError('wrong parameters: cannot specify both \'before\' and \'after\'', { reason: 'INPUT_VALIDATION' });
  }
  if (inputData.page !== undefined && (inputData.before !== undefined || inputData.after !== undefined)) {
    throwError('wrong parameters: cannot use both \'page\' and \'before|after\'', { reason: 'INPUT_VALIDATION' });
  }

  for (const name of ['before', 'after']) {
    const token = inputData[name];
    if (token === undefined || token === '') { continue; }
    if (typeof token !== 'string') {
      throwError(`wrong parameters: '${name}' must be a string`, { reason: 'INPUT_VALIDATION' });
    }
    let decodedToken;
    try {
      decodedToken = decode({ token });
    } catch (innererror) {
      throwError(`wrong parameters: '${name}' is invalid`, { reason: 'INPUT_VALIDATION', innererror });
    }

    inputData[name] = decodedToken;
  }
  return inputData;
};


module.exports = {
  validatePaginationInput,
};
