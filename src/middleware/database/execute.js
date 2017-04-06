'use strict';


// Fake database for the moment
const database = require('./data.json');
const { fireOperation } = require('./operations');


const executeDatabaseOperation = async function () {
  return async function (input) {
    const { operation, args: { order_by: orderBy, data, id, ids, filters } = {}, modelName } = input;
    const collection = database[modelName];
    collection.modelName = modelName;

    const response = fireOperation({ operation, modelName, collection, filters, id, ids, orderBy, data });
    return response;
  };
};


module.exports = {
  executeDatabaseOperation,
};
