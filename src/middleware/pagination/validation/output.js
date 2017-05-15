'use strict';


const { getThrowError } = require('../throw_error');
const { getPaginationInfo } = require('../info');
const { decode } = require('../encoding');
const { validate } = require('../../../validation');


 // Validate response.metadata related to pagination
const validatePaginationOutput = function ({ args, action, modelName, maxPageSize, response: { data, metadata } }) {
  const throwError = getThrowError({ action, modelName });

  const schema = getOutputSchema({ maxPageSize });
  const pages = getOutputData({ throwError, metadata });
  validate({ schema, data: pages, reportInfo: { type: 'paginationOutput', action, modelName, dataVar: 'response' } });

  const { usedPageSize } = getPaginationInfo({ args });
  if (data.length > usedPageSize) {
    throwError(`database returned pagination batch larger than specified page size ${args.page_size}`, {
      reason: 'OUTPUT_VALIDATION',
    });
  }
};

const getOutputSchema = function ({ maxPageSize }) {
  return {
    type: 'array',
    items: {
      type: 'object',

      properties: {
        has_previous_page: {
          type: 'boolean',
        },
        has_next_page: {
          type: 'boolean',
        },

        token: {
          type: ['null', 'object'],
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
            },
            filter: {
              type: 'string',
            },
          },
        },

        page_size: {
          type: 'integer',
          minimum: 1,
          maximum: maxPageSize,
        },

        page: {
          type: 'integer',
          minimum: 0,
        },
      },
    },
  };
};

// Returns response.metadata related to pagination, after decoding token
const getOutputData = function ({ throwError, metadata }) {
  return metadata.map(({ pages }) => {
    const { token } = pages;
    if (token === undefined || token === '') { return pages; }
    if (typeof token !== 'string') {
      throwError('wrong response: \'token\' must be a string', { reason: 'OUTPUT_VALIDATION' });
    }
    try {
      const parsedToken = decode({ token });
      return Object.assign({}, pages, { token: parsedToken });
    } catch (innererror) {
      throwError('wrong response: \'token\' is invalid', { reason: 'OUTPUT_VALIDATION', innererror });
    }
  });
};


module.exports = {
  validatePaginationOutput,
};
