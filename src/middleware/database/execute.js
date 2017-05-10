'use strict';


const { chain, pickBy } = require('lodash');

// Fake database for the moment
const database = require('./data.json');
const { fireAction } = require('./actions');


const executeDatabaseAction = async function ({ idl: { models } }) {
  // Gets a map of models' writeOnce attributes, e.g. { my_model: ['my_writeonce_attribute', ...], ... }
  const writeOnceMap = chain(models)
    .pickBy(modelIdl => modelIdl && modelIdl.properties)
    .mapValues(modelIdl => Object.keys(pickBy(modelIdl.properties, prop => prop.writeOnce)))
    .value();

  return async function executeDatabaseAction(input) {
    const { action, args: { order_by: orderBy, dry_run: dryRun, data, filter } = {}, modelName, info, params } = input;
    const { ip, timestamp, actionType, helpers, variables } = info;
    const jslInput = { helpers, variables, requestInput: { ip, timestamp, params }, interfaceInput: { actionType } };
    const collection = database[modelName];

    const writeOnceAttributes = writeOnceMap[modelName];
    const opts = { jslInput, orderBy, writeOnceAttributes, dryRun, modelName };
    const response = fireAction({ action, collection, filter, data, opts });
    return response;
  };
};


module.exports = {
  executeDatabaseAction,
};
