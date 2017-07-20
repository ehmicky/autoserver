'use strict';

const { allowFullPagination, mustPaginateOutput } = require('../../condition');
const {
  parsedTokenSchema,
  pageSizeSchema,
  pageSchema,
} = require('../args_schemas');

const getInputSchema = function ({ args, command, maxPageSize }) {
  if (allowFullPagination({ args, command })) {
    return getFullSchema({ maxPageSize });
  }

  if (mustPaginateOutput({ args, command })) {
    return getLimitedSchema({ maxPageSize });
  }

  return restrictedSchema;
};

// JSON schema when consumers can specify args.before|after|pageSize|page
const getFullSchema = function ({ maxPageSize }) {
  return {
    type: 'object',

    properties: {
      before: parsedTokenSchema,
      after: parsedTokenSchema,
      pageSize: pageSizeSchema({ maxPageSize }),
      page: pageSchema,
    },
  };
};

// JSON schema when consumers can only specify args.pageSize
const getLimitedSchema = function ({ maxPageSize }) {
  return {
    type: 'object',

    properties: {
      pageSize: pageSizeSchema({ maxPageSize }),
    },

    not: {
      anyOf: [
        { required: ['page'] },
      ],
    },
  };
};

// JSON schema when consumers cannot specify any pagination-related argument
const restrictedSchema = {
  not: {
    anyOf: [
      { required: ['page'] },
    ],
  },
};

module.exports = {
  getInputSchema,
};
