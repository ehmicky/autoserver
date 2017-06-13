'use strict';


const { pick } = require('../../../utilities');
const { validate } = require('../../../validation');


/**
 * Check arguments, for client-side errors.
 * In a nutshell, checks that:
 *  - required arguments are defined
 *  - disabled or unknown arguments are not defined
 *  - arguments that are defined follow correct syntax
 *    Does not check for semantics (e.g. IDL validation)
 **/
const validateSyntax = function ({ args, action }) {
  const type = 'clientInputSyntax';
  const schema = actionSchemas[action.name];
  validate({ schema, data: args, reportInfo: { type } });
};

// JSON schema common to any argument
const commonSchema = {
  type: 'object',
  additionalProperties: false,
};

// JSON schema for each argument
const argsSchema = {
  dry_run: { type: 'boolean' },

  // Database validation middleware does some extra checks on those attributes
  singleData: { type: 'object' },
  singleDataWithId: { type: 'object', required: ['id'] },
  multipleData: { type: 'array', items: { type: 'object' } },
  multipleDataWithId: {
    type: 'array',
    items: { type: 'object', required: ['id'] },
  },

  // Normalization middleware does some extra checks on those attributes
  filter: { oneOf: [ { type: 'string' }, { type: 'object' } ] },
  order_by: { type: 'string' },

  // Pagination middleware does some extra checks on those attributes
  page_size: { type: 'integer' },
  page: { type: 'integer' },
  before: { type: 'string' },
  after: { type: 'string' },
};

const findOne = Object.assign(
  {
    properties: Object.assign(
      {},
      pick(argsSchema, [
        'filter',
      ]),
    ),
    required: [
      'filter',
    ],
  },
  commonSchema,
);

const findMany = Object.assign(
  {
    properties: Object.assign(
      {},
      pick(argsSchema, [
        'dry_run',
        'filter',
        'order_by',
        'page_size',
        'page',
        'before',
        'after',
      ]),
    ),
    required: [
    ],
  },
  commonSchema,
);

const createOne = Object.assign(
  {
    properties: Object.assign(
      {
        data: argsSchema.singleData,
      },
      pick(argsSchema, [
        'dry_run',
      ]),
    ),
    required: [
      'data',
    ],
  },
  commonSchema,
);

const createMany = Object.assign(
  {
    properties: Object.assign(
      {
        data: argsSchema.multipleData,
      },
      pick(argsSchema, [
        'dry_run',
        'order_by',
        'page_size',
      ]),
    ),
    required: [
      'data',
    ],
  },
  commonSchema,
);

const replaceOne = Object.assign(
  {
    properties: Object.assign(
      {
        data: argsSchema.singleDataWithId,
      },
      pick(argsSchema, [
        'dry_run',
      ]),
    ),
    required: [
      'data',
    ],
  },
  commonSchema,
);

const replaceMany = Object.assign(
  {
    properties: Object.assign(
      {
        data: argsSchema.multipleDataWithId,
      },
      pick(argsSchema, [
        'dry_run',
        'order_by',
        'page_size',
      ]),
    ),
    required: [
      'data',
    ],
  },
  commonSchema,
);

const updateOne = Object.assign(
  {
    properties: Object.assign(
      {
        data: argsSchema.singleData,
      },
      pick(argsSchema, [
        'dry_run',
        'filter',
      ]),
    ),
    required: [
      'filter',
      'data',
    ],
  },
  commonSchema,
);

const updateMany = Object.assign(
  {
    properties: Object.assign(
      {
        data: argsSchema.singleData,
      },
      pick(argsSchema, [
        'dry_run',
        'filter',
        'order_by',
        'page_size',
      ]),
    ),
    required: [
      'data',
    ],
  },
  commonSchema,
);

const upsertOne = Object.assign(
  {
    properties: Object.assign(
      {
        data: argsSchema.singleDataWithId,
      },
      pick(argsSchema, [
        'dry_run',
      ]),
    ),
    required: [
      'data',
    ],
  },
  commonSchema,
);

const upsertMany = Object.assign(
  {
    properties: Object.assign(
      {
        data: argsSchema.multipleDataWithId,
      },
      pick(argsSchema, [
        'dry_run',
        'order_by',
        'page_size',
      ]),
    ),
    required: [
      'data',
    ],
  },
  commonSchema,
);

const deleteOne = Object.assign(
  {
    properties: Object.assign(
      {},
      pick(argsSchema, [
        'dry_run',
        'filter',
      ]),
    ),
    required: [
      'filter',
    ],
  },
  commonSchema,
);

const deleteMany = Object.assign(
  {
    properties: Object.assign(
      {},
      pick(argsSchema, [
        'dry_run',
        'filter',
        'order_by',
        'page_size',
      ]),
    ),
    required: [
    ],
  },
  commonSchema,
);

// JSON schemas validating `args` for each action
const actionSchemas = {
  findOne,
  findMany,
  createOne,
  createMany,
  replaceOne,
  replaceMany,
  updateOne,
  updateMany,
  upsertOne,
  upsertMany,
  deleteOne,
  deleteMany,
};


module.exports = {
  validateSyntax,
};
