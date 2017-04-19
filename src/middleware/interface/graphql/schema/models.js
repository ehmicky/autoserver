'use strict';


const { chain, merge, assign } = require('lodash');
const { getOperationName } = require('./name');
const { getSubDefProp } = require('./utilities');
const { operations } = require('../../../../idl');


// Mapping from IDL operations to GraphQL methods
const graphqlOperations = {
  query: ['find'],
  mutation: ['create', 'replace', 'update', 'upsert', 'delete'],
};

// Retrieve models for a given method
const getModelsByMethod = function (methodName, { idl: { models } }) {
  // Iterate through each operation
  return chain(operations)
    // Only include operations for a given GraphQL method
    .filter(({ opType }) => graphqlOperations[methodName].includes(opType))
    // Iterate through each model
		.mapValues(operation => chain(models)
      // Remove model that are not allowed for a given operation
      .pickBy(model => isAllowedModel({ model, operation }))
      // Modify object key to include operation information, e.g. 'my_model' + 'findMany' -> 'findMyModels'
      // This will be used as the top-level methods names
      .mapKeys((_, modelName) => getOperationName({ modelName, operation }))
      .mapValues(model => {
        // Wrap in array if operation is multiple
        if (operation.multiple) {
          model = { type: 'array', items: model };
        }

        // Add operation information to the definition
        const modelCopy = merge({}, model, { opType: operation.opType });
        return modelCopy;
      })
      .value()
    )
    // Turn [{...}, {...}, {...}] into {... ... ...}
    .reduce(assign)
    .value();
};

// Filter allowed operations on a given model
const isAllowedModel = function ({ model, operation }) {
  // IDL property `def.operations` allows whitelisting specific operations
  const modelOperations = getSubDefProp(model, 'operations');
  // Check whether model operation is whitelisted
  return modelOperations.includes(operation.name);
};


module.exports = {
  getModelsByMethod,
};
