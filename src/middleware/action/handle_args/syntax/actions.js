'use strict';

const actionsArgs = {
  findOne: {
    optional: [],
    required: ['filter'],
  },
  findMany: {
    optional: ['filter', 'order_by', 'page_size', 'page', 'before', 'after'],
    required: [],
  },
  deleteOne: {
    optional: [],
    required: ['filter'],
  },
  deleteMany: {
    optional: ['filter', 'order_by', 'page_size'],
    required: [],
  },
  updateOne: {
    optional: [],
    required: ['filter', 'singleData'],
  },
  updateMany: {
    optional: ['filter', 'order_by', 'page_size'],
    required: ['singleData'],
  },
  createOne: {
    optional: [],
    required: ['singleData'],
  },
  createMany: {
    optional: ['order_by', 'page_size'],
    required: ['multipleData'],
  },
  replaceOne: {
    optional: [],
    required: ['singleDataWithId'],
  },
  replaceMany: {
    optional: ['order_by', 'page_size'],
    required: ['multipleDataWithId'],
  },
  upsertOne: {
    optional: [],
    required: ['singleDataWithId'],
  },
  upsertMany: {
    optional: ['order_by', 'page_size'],
    required: ['multipleDataWithId'],
  },
};

module.exports = {
  actionsArgs,
};
