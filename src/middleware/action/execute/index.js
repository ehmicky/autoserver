'use strict';

const { createAction } = require('./create');
const { findAction } = require('./find');
const { updateAction } = require('./update');
const { upsertAction } = require('./upsert');
const { replaceAction } = require('./replace');
const { deleteAction } = require('./delete');

// Translates operation-specific calls into generic instance actions
const actionExecute = async function (input) {
  const middleware = getMiddleware(input);
  const response = await middleware.call(this, input);
  return response;
};

const getMiddleware = function ({ action }) {
  return middlewares[action.name];
};

Object.assign(actionExecute, { getMiddleware });

const middlewares = {
  createOne: createAction,
  createMany: createAction,
  findOne: findAction,
  findMany: findAction,
  updateOne: updateAction,
  updateMany: updateAction,
  upsertOne: upsertAction,
  upsertMany: upsertAction,
  replaceOne: replaceAction,
  replaceMany: replaceAction,
  deleteOne: deleteAction,
  deleteMany: deleteAction,
};

module.exports = {
  actionExecute,
};
