'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { createAction } = require('./create_action');
const { findAction } = require('./find_action');
const { updateAction } = require('./update_action');
const { upsertAction } = require('./upsert_action');
const { replaceAction } = require('./replace_action');
const { deleteAction } = require('./delete_action');


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
const getKey = ({ input: { action } }) => action.name;

// Translates interface-specific calls into generic instance actions
const actionExecute = getSwitchMiddleware({
  middlewares,
  getKey,
  name: 'executeAction',
});


module.exports = {
  actionExecute,
};
