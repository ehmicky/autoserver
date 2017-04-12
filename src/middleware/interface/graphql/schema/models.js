'use strict';


const { chain, merge, map } = require('lodash');
const { getOperationNameFromModel } = require('./name');
const { getSubDefProp } = require('./utilities');
const { operations } = require('../../../../idl');


// Mapping from IDL operations to GraphQL methods
const graphqlOperations = {
  query: ['find'],
  mutation: ['create', 'replace', 'update', 'upsert', 'delete'],
};

// Retrieve models for a given method
const getModelsByMethod = function (methodName, opts) {
  return chain(operations)
    .filter(operation => graphqlOperations[methodName].includes(operation.opType))
		.map(operation => getModelsByOperation(operation, opts))
    .flatten()
		.filter(model => isAllowedModel(model, opts))
    .mapKeys(model => model.propName)
    .value();
};

// Retrieve models for a given operation
const getModelsByOperation = function (operation, { idl: { models } }) {
  return map(models, model => {
    // Deep copy
    model = merge({}, model);

    const propName = getOperationNameFromModel({ def: model, opType: operation.opType, asPlural: operation.multiple });

    if (operation.multiple) {
      model = { type: 'array', items: model };
    }

    Object.assign(model, {
      // E.g. 'findPet', used as GraphQL field name
      propName,
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

// Filter allowed operations on a given model
const isAllowedModel = function (model, { idl: { operations: defaultOperations } }) {
  // IDL property `def.operations` allows whitelisting specific operations
  const modelOperations = getSubDefProp(model, 'operations') || defaultOperations;
  // Normalize shortcuts, e.g. 'find' -> 'findOne' + 'findMany'
  const normalizedOperations = modelOperations.reduce((memo, operation) => {
    const normalizedOperation = operation.endsWith('One') ? operation : [`${operation}One`, `${operation}Many`];
    return memo.concat(normalizedOperation);
  }, []);
  // Check whether model operation is whitelisted
  return normalizedOperations.includes(model.baseOperationName);
};


module.exports = {
  getModelsByMethod,
};
