'use strict';

// JSON schema common to any argument
const commonSchema = {
  type: 'object',
  additionalProperties: false,
};

// JSON schema for each argument
const argsSchema = {
  // Database validation middleware does some extra checks on those attributes
  // `args.data` can be an array, or not, depending on the action
  // Also, `args.data` requires `id` on some actions.
  singleData: { name: 'data', type: 'object' },
  singleDataWithId: { name: 'data', type: 'object', required: ['id'] },
  multipleData: { name: 'data', type: 'array', items: { type: 'object' } },
  multipleDataWithId: {
    name: 'data',
    type: 'array',
    items: { type: 'object', required: ['id'] },
  },

  // Normalization middleware does some extra checks on those attributes
  filter: {
    oneOf: [
      { type: 'object' },
      { type: 'array', items: { type: 'object' } },
    ],
  },
  order_by: { type: 'string' },

  // Pagination middleware does some extra checks on those attributes
  page_size: { type: 'integer' },
  page: { type: 'integer' },
  before: { type: 'string' },
  after: { type: 'string' },
};

module.exports = {
  commonSchema,
  argsSchema,
};
