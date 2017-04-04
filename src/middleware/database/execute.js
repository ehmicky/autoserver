'use strict';


// Fake database for the moment
const database = require('./data.json');
const { validateDatabaseInput } = require('./validate');
const { fireOperation } = require('./operations');


const executeDatabaseOperation = async function () {
  return async function (input) {
    const { operation, args = {}, modelName } = input;
    const { order_by: orderBy, data, id, ids, filter: filters } = args;
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
