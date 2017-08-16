'use strict';

// JSON schema validating a pagination token
const tokenSchema = {
  type: 'object',
  required: ['nOrderBy', 'filter', 'parts'],
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
    filter: {
      type: 'object',
    },
  },
};

const parsedTokenSchema = {
  oneOf: [
    {
      type: 'string',
      const: '',
    },
    tokenSchema,
  ],
};

const pageSizeSchema = ({ maxPageSize }) => ({
  type: 'integer',
  minimum: 1,
  maximum: maxPageSize,
});

const pageSchema = {
  type: 'integer',
  minimum: 1,
};

const hasPreviousPageSchema = {
  type: 'boolean',
};

const hasNextPageSchema = {
  type: 'boolean',
};

module.exports = {
  tokenSchema,
  parsedTokenSchema,
  pageSizeSchema,
  pageSchema,
  hasPreviousPageSchema,
  hasNextPageSchema,
};
