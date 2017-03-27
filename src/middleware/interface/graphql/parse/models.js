'use strict';


const { merge, mapKeys } = require('lodash');
const { getDefinitionName, getOperationName } = require('./name');


// Retrieve models for a given method
const getModelsByMethod = function (methodName, { allModels, bulkWrite, bulkDelete }) {
  // All operations (e.g. "createUser", etc.) for that method (e.g. "query")
  const methodOperations = operations.filter(operation => operation.method === methodName
    && !(!bulkWrite && operation.isBulkWrite)
    && !(!bulkDelete && operation.isBulkDelete));
  const models = methodOperations.reduce((methodModels, operation) => {
    const operationModels = getModelsByOperation(operation, { allModels });
    return methodModels.concat(operationModels);
  }, []);
  const modelsMap = mapKeys(models, model => model.operationName);
  return modelsMap;
};

// Retrieve models for a given operation
const getModelsByOperation = function (operation, { allModels }) {
  return allModels.map(model => {
    // Deep copy
    model = merge({}, model);

    // `find*` operations are aliased for convenience
    // E.g. `findPet` and `findPets` -> `pet` and `pets`
    const operationName = operation.opType === 'find' ?
      getDefinitionName(model, { asPlural: operation.multiple }) :
      getOperationName(model, operation.opType, { asPlural: operation.multiple });

    if (operation.multiple) {
      model = { type: 'array', items: model };
    }

    Object.assign(model, {
      // E.g. 'findPet', used as GraphQL field name
      operationName,
      // E.g. 'find'
      opType: operation.opType,
    });

    return model;
  }, []);
};

const findOperations = function ({ opType, multiple }) {
  return operations.find(operation => operation.opType === opType && operation.multiple == multiple);
};

/* eslint-disable no-multi-spaces */
const operations = [
  { name: 'findOne',     opType: 'find',     method: 'query',    multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'findMany',    opType: 'find',     method: 'query',    multiple: true,   isBulkWrite: false, isBulkDelete: false },
  { name: 'createOne',   opType: 'create',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'createMany',  opType: 'create',   method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'replaceOne',  opType: 'replace',  method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'replaceMany', opType: 'replace',  method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'updateOne',   opType: 'update',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'updateMany',  opType: 'update',   method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'upsertOne',   opType: 'upsert',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'upsertMany',  opType: 'upsert',   method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'deleteOne',   opType: 'delete',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'deleteMany',  opType: 'delete',   method: 'mutation', multiple: true,   isBulkWrite: false, isBulkDelete: true  },
];
/* eslint-enable no-multi-spaces */


module.exports = {
  getModelsByMethod,
  findOperations,
};