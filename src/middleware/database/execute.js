'use strict';


// Fake database for the moment
const database = require('./data.json');
const { fireAction } = require('./actions');


const executeDatabaseAction = async function () {
  return async function (input) {
    const { action, args: { order_by: orderBy, data, filter } = {}, modelName } = input;
    const collection = database[modelName];
    collection.modelName = modelName;

    const response = fireAction({ action, modelName, collection, filter, orderBy, data });
    return response;
  };
};


module.exports = {
  executeDatabaseAction,
};
