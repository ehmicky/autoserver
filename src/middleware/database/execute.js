'use strict';


const { omit } = require('lodash');

// Fake database for the moment
const database = require('./data.json');
const { validateDatabaseInput } = require('./validate');
const { fireOperation } = require('./operations');


const executeDatabaseOperation = async function () {
  return async function (input) {
    const { operation, args = {}, modelName } = input;
    const { order_by: orderBy = 'id+', data, id, ids } = args;
    const filters = omit(args, ['order_by', 'data', 'id', 'ids']);
    const collection = database[modelName];

    validateDatabaseInput({ operation, modelName });
    collection.modelName = modelName;

    const response = fireOperation({ operation, modelName, collection, filters, id, ids, orderBy, data });
    return response;
  };
};


module.exports = {
  executeDatabaseOperation,
};