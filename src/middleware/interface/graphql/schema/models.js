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
		.filter(model => isAllowedModel(model))
    .mapKeys(model => model.propName)
    .value();
};

// Retrieve models for a given operation
const getModelsByOperation = function (operation, { idl: { models } }) {
  return map(models, model => {
    const propName = getOperationNameFromModel({ def: model, opType: operation.opType, asPlural: operation.multiple });

    if (operation.multiple) {
      model = { type: 'array', items: model };
    }

    const modelCopy = merge({}, model, { propName, operation });
    return modelCopy;
  });
};

// Filter allowed operations on a given model
const isAllowedModel = function (model) {
  // IDL property `def.operations` allows whitelisting specific operations
  const modelOperations = getSubDefProp(model, 'operations');
  // Check whether model operation is whitelisted
  return modelOperations.includes(model.operation.name);
};


module.exports = {
  getModelsByMethod,
};
