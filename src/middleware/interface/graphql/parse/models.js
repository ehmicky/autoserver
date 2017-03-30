'use strict';


const { merge, mapKeys } = require('lodash');
const { getOperationNameFromModel } = require('./name');
const { getSubDefProp } = require('./utilities');


// Retrieve models for a given method
const getModelsByMethod = function (methodName, opts) {
  const models = operations
    .filter(operation => operation.method === methodName)
		.reduce((methodModels, operation) => {
      const operationModels = getModelsByOperation(operation, opts);
      return methodModels.concat(operationModels);
    }, [])
		.filter(model => isAllowedModel(model, opts));
  const modelsMap = mapKeys(models, model => model.operationName);
  return modelsMap;
};

// Filter allowed operations on a given model
const isAllowedModel = function (model, { idl: { operations: defaultOperations } }) {
  // IDL property `def.operations` allows whitelisting specific operations
  let modelOperations = getSubDefProp(model, 'operations') || defaultOperations;
  if (modelOperations) {
    // Normalize shortcuts, e.g. 'find' -> 'findOne' + 'findMany'
    modelOperations = modelOperations.reduce((memo, modelOperation) => {
      if (modelOperation.endsWith('One') || modelOperation.endsWith('Many')) {
        return memo.concat(modelOperation);
      }
      return memo.concat([`${modelOperation}One`, `${modelOperation}Many`]);
    }, []);
    // Check whether model operation is whitelisted
    if (!modelOperations.includes(model.baseOperationName)) { return false; }
  }

  return true;
};

// Retrieve models for a given operation
const getModelsByOperation = function (operation, { idl: { models: allModels } }) {
  return allModels.map(model => {
    // Deep copy
    model = merge({}, model);

    const operationName = getOperationNameFromModel({ def: model, opType: operation.opType, asPlural: operation.multiple });

    if (operation.multiple) {
      model = { type: 'array', items: model };
    }

    Object.assign(model, {
      // E.g. 'findPet', used as GraphQL field name
      operationName,
      // E.g. 'findOne'
      baseOperationName: operation.name,
      // E.g. 'find'
      opType: operation.opType,
      // top-level models might e.g. get different arguments
      isTopLevel: true,
    });

    return model;
  }, []);
};


const findOperations = function ({ opType, multiple }) {
  return operations.find(operation => operation.opType === opType && operation.multiple == multiple);
};

/* eslint-disable no-multi-spaces */
const operations = [
  { name: 'findOne',     opType: 'find',     method: 'query',    multiple: false,  },
  { name: 'findMany',    opType: 'find',     method: 'query',    multiple: true,   },
  { name: 'createOne',   opType: 'create',   method: 'mutation', multiple: false,  },
  { name: 'createMany',  opType: 'create',   method: 'mutation', multiple: true,   },
  { name: 'replaceOne',  opType: 'replace',  method: 'mutation', multiple: false,  },
  { name: 'replaceMany', opType: 'replace',  method: 'mutation', multiple: true,   },
  { name: 'updateOne',   opType: 'update',   method: 'mutation', multiple: false,  },
  { name: 'updateMany',  opType: 'update',   method: 'mutation', multiple: true,   },
  { name: 'upsertOne',   opType: 'upsert',   method: 'mutation', multiple: false,  },
  { name: 'upsertMany',  opType: 'upsert',   method: 'mutation', multiple: true,   },
  { name: 'deleteOne',   opType: 'delete',   method: 'mutation', multiple: false,  },
  { name: 'deleteMany',  opType: 'delete',   method: 'mutation', multiple: true,   },
];
/* eslint-enable no-multi-spaces */


module.exports = {
  getModelsByMethod,
  findOperations,
};