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
    const operationName = operation.prefix === 'find' ?
      getDefinitionName(model, { asPlural: operation.multiple }) :
      getOperationName(model, operation.prefix, { asPlural: operation.multiple });

    if (operation.multiple) {
      model = { type: 'array', items: model };
    }

    Object.assign(model, {
      // E.g. 'findPet', used as GraphQL field name
      operationName,
      // E.g. 'find'
      operation: operation.prefix,
    });

    return model;
  }, []);
};

const findOperations = function ({ prefix, multiple }) {
  return operations.find(operation => operation.prefix === prefix && operation.multiple == multiple);
};

/* eslint-disable no-multi-spaces */
const operations = [
  { name: 'findOne',      prefix: 'find',     method: 'query',    multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'findMany',     prefix: 'find',     method: 'query',    multiple: true,   isBulkWrite: false, isBulkDelete: false },
  { name: 'createOne',    prefix: 'create',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'createMany',   prefix: 'create',   method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'replaceOne',   prefix: 'replace',  method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'replaceMany',  prefix: 'replace',  method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'updateOne',    prefix: 'update',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'updateMany',   prefix: 'update',   method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'upsertOne',    prefix: 'upsert',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'upsertMany',   prefix: 'upsert',   method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'deleteOne',    prefix: 'delete',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'deleteMany',   prefix: 'delete',   method: 'mutation', multiple: true,   isBulkWrite: false, isBulkDelete: true  },
];
/* eslint-enable no-multi-spaces */


module.exports = {
  getModelsByMethod,
  findOperations,
};
