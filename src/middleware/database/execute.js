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

  return async function (input) {
    const { action, args: { order_by: orderBy, data, filter } = {}, modelName, info: { ip, timestamp, actionType, helpers }, params } = input;
    const jslInput = { helpers, requestInput: { ip, timestamp, params }, modelInput: { actionType } };
    const collection = database[modelName];
    collection.modelName = modelName;

    const writeOnceAttributes = writeOnceMap[modelName];
    const response = fireAction({ action, modelName, collection, filter, orderBy, data, jslInput, writeOnceAttributes });
    return response;
  };
};


module.exports = {
  executeDatabaseAction,
};
