'use strict';

const { fireAction } = require('./execute');
const { createAction } = require('./create');
const { findAction } = require('./find');
const { updateAction } = require('./update');
const { upsertAction } = require('./upsert');
const { replaceAction } = require('./replace');
const { deleteAction } = require('./delete');

// Translates operation-specific calls into generic instance actions
const actionExecute = async function (input) {
  const action = middlewares[input.action.type];
  const response = await fireAction.call(this, { input, action });
  return response;
};

const middlewares = {
  create: createAction,
  find: findAction,
  update: updateAction,
  upsert: upsertAction,
  replace: replaceAction,
  delete: deleteAction,
};

module.exports = {
  actionExecute,
};
