'use strict';

const { validate } = require('../../../../validation');
const { EngineError } = require('../../../../error');
const { getPaginationInfo } = require('../info');
const { decode } = require('../encoding');

// Validate response.metadata related to pagination
const validatePaginationOutput = function ({
  args,
  action,
  modelName,
  maxPageSize,
  response: { data, metadata },
}) {
  const schema = getOutputSchema({ maxPageSize });
  const pages = getOutputData({ metadata });
  const reportInfo = {
    type: 'paginationOutput',
    action,
    modelName,
    dataVar: 'response',
  };
  validate({ schema, data: pages, reportInfo });

  const { usedPageSize } = getPaginationInfo({ args });

  if (data.length > usedPageSize) {
    const message = `Database returned pagination batch larger than specified page size ${args.pageSize}`;
    throw new EngineError(message, { reason: 'OUTPUT_VALIDATION' });
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
const getOutputData = function ({ metadata }) {
  return metadata.map(({ pages }) => {
    const { token } = pages;
    if (token === undefined || token === '') { return pages; }

    if (typeof token !== 'string') {
      const message = 'Wrong response: \'token\' must be a string';
      throw new EngineError(message, { reason: 'OUTPUT_VALIDATION' });
    }

    try {
      const parsedToken = decode({ token });
      return Object.assign({}, pages, { token: parsedToken });
    } catch (error) {
      const message = 'Wrong response: \'token\' is invalid';
      throw new EngineError(message, {
        reason: 'OUTPUT_VALIDATION',
        innererror: error,
      });
    }
  });
};

module.exports = {
  validatePaginationOutput,
};
