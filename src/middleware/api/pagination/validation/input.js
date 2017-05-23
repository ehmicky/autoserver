'use strict';


const { validate } = require('../../../../validation');
const { EngineError } = require('../../../../error');
const { allowFullPagination, mustPaginateOutput } = require('../condition');
const { decode } = require('../encoding');


// Validate args.before|after|page_size|page
const validatePaginationInput = function ({
  args,
  sysArgs,
  action,
  command,
  modelName,
  maxPageSize,
}) {
  let schema;
  if (allowFullPagination({ args, sysArgs, command })) {
    schema = getFullSchema({ args, maxPageSize });
  } else if (mustPaginateOutput({ args, sysArgs })) {
    schema = getLimitedSchema({ maxPageSize });
  } else {
    schema = restrictedSchema;
  }
  const data = getInputData({ args });

  const reportInfo = {
    type: 'paginationInput',
    action,
    modelName,
    dataVar: 'arguments',
  };
  validate({ schema, data, reportInfo });
};

// JSON schema when consumers can specify args.before|after|page_size|page
const getFullSchema = function ({
  args: { orderBy, filter } = {},
  maxPageSize,
}) {
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

// JSON schema when consumers can only specify args.page_size
const getLimitedSchema = function ({ maxPageSize }) {
  return {
    type: 'object',

    properties: {
      page_size: {
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
      { required: ['page_size'] },
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
  const hasTwoPaginationTypes = inputData.page !== undefined &&
    (inputData.before !== undefined || inputData.after !== undefined);
  if (hasTwoPaginationTypes) {
    const message = 'Wrong parameters: cannot use both \'page\' and \'before|after\'';
    throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
  }

  for (const name of ['before', 'after']) {
    const token = inputData[name];
    if (token === undefined || token === '') { continue; }
    if (typeof token !== 'string') {
      const message = `Wrong parameters: '${name}' must be a string`;
      throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
    }
    let decodedToken;
    try {
      decodedToken = decode({ token });
    } catch (innererror) {
      const message = `Wrong parameters: '${name}' is invalid`;
      throw new EngineError(message, {
        reason: 'INPUT_VALIDATION',
        innererror,
      });
    }

    inputData[name] = decodedToken;
  }
  return inputData;
};


module.exports = {
  validatePaginationInput,
};
