'use strict';


const { chain, pickBy } = require('lodash');

// Fake database for the moment
const database = require('./data.json');
const { fireAction } = require('./actions');


const executeDatabaseAction = async function ({ idl: { models } }) {
  // Gets a map of models' writeOnce attributes,
  // e.g. { my_model: ['my_writeonce_attribute', ...], ... }
  const writeOnceMap = chain(models)
    .pickBy(modelIdl => modelIdl && modelIdl.properties)
    .mapValues(modelIdl => {
      const props = pickBy(modelIdl.properties, ({ writeOnce }) => writeOnce);
      return Object.keys(props);
    })
    .value();

  return async function executeDatabaseAction(input) {
    const { action, args = {}, modelName, info, params } = input;
    const {
      order_by: orderBy,
      limit,
      offset,
      dry_run: dryRun,
      no_output: noOutput,
      data,
      filter,
    } = args;
    const { ip, timestamp, actionType, helpers, variables } = info;
    const requestInput = { ip, timestamp, params };
    const interfaceInput = { actionType };
    const jslInput = { helpers, variables, requestInput, interfaceInput };
    const collection = database[modelName];

    const writeOnceAttributes = writeOnceMap[modelName];
    const opts = {
      jslInput,
      orderBy,
      limit,
      offset,
      dryRun,
      noOutput,
      writeOnceAttributes,
      modelName,
    };
    const response = fireAction({ action, collection, filter, data, opts });
    return response;
  };
};


module.exports = {
  executeDatabaseAction,
};
