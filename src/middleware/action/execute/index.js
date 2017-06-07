'use strict';


const { mapAsync } = require('../../../utilities');
const { createAction } = require('./create_action');
const { findAction } = require('./find_action');
const { updateAction } = require('./update_action');
const { upsertAction } = require('./upsert_action');
const { replaceAction } = require('./replace_action');
const { deleteAction } = require('./delete_action');


// Translates interface-specific calls into generic instance actions
const actionExecute = async function (opts) {
  const mdws = await mapAsync(middlewares, async mdw => await mdw(opts));

  return async function actionExecute(input) {
    return await mdws[input.action.name].call(this, input);
  };
};

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
