'use strict';


const { chain, merge, assign } = require('lodash');
const { getOperationName } = require('./name');
const { isModel, isMultiple } = require('./utilities');
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
        // Deep copy
        let modelCopy = merge({}, model);

        // Add operation information to the nested models
        const properties = chain(model.properties)
          .pickBy(prop => isModel(prop))
          .mapValues(subModel => {
            const subOperation = Object.assign({}, operation, { multiple: isMultiple(subModel) });
            return Object.assign({}, subModel, { operation: subOperation });
          })
          .value();
        merge(modelCopy, { properties });

        // Wrap in array if operation is multiple
        if (operation.multiple) {
          modelCopy = { type: 'array', items: modelCopy };
        }

        // Add operation information to the top-level model
        Object.assign(modelCopy, { operation });
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
  return model.operations.includes(operation.name);
};


module.exports = {
  getModelsByMethod,
};
