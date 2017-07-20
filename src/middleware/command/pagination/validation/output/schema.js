'use strict';

const {
  tokenSchema,
  pageSizeSchema,
  pageSchema,
  hasPreviousPageSchema,
  hasNextPageSchema,
} = require('../args_schemas');

const getOutputSchema = function ({ maxPageSize }) {
  return {
    type: 'array',
    items: {
      type: 'object',

      properties: {
        has_previous_page: hasPreviousPageSchema,
        has_next_page: hasNextPageSchema,
        token: tokenSchema,
        page_size: pageSizeSchema({ maxPageSize }),
        page: pageSchema,
      },
    },
  };
};

module.exports = {
  getOutputSchema,
};
