'use strict';


const { chain, cloneDeep, merge, assign, mapValues } = require('lodash');
const { getActionName } = require('./name');
const { getSubDef, isModel, isMultiple } = require('./utilities');
const { actions } = require('../../../../idl');


// Mapping from IDL actions to GraphQL methods
const graphqlMethods = {
  query: ['find'],
  mutation: ['create', 'replace', 'update', 'upsert', 'delete'],
};

// Retrieve models for a given method
const getModelsByMethod = function ({ methodName, models }) {
  // Iterate through each action
  return chain(actions)
    // Only include actions for a given GraphQL method
    .filter(({ actionType }) => graphqlMethods[methodName].includes(actionType))
    // Iterate through each model
    .mapValues(action => chain(models)
      // Remove model that are not allowed for a given action
      .pickBy(model => isAllowedModel({ model, action }))
      // Modify object key to include action information, e.g. 'my_model' + 'findMany' -> 'findMyModels'
      // This will be used as the top-level methods names
      .mapKeys((_, modelName) => getActionName({ modelName, actionType: action.actionType, multiple: action.multiple }))
      .mapValues(model => {
        // Deep copy
        let modelCopy = cloneDeep(model);

        // Add action information to the nested models
        const properties = mapValues(model.properties, def => {
          const subDef = getSubDef(def);
          if (!isModel(subDef)) { return def; }

          const multiple = isMultiple(def);
          const subAction = Object.assign({}, action, { multiple });
          return Object.assign({}, def, { action: subAction });
        });
        merge(modelCopy, { properties, isTopLevel: true });

        // Wrap in array if action is multiple
        if (action.multiple) {
          modelCopy = { type: 'array', items: modelCopy };
        }

        // Add action information to the top-level model
        Object.assign(modelCopy, { action });
        return modelCopy;
      })
      .value()
    )
    // Turn [{...}, {...}, {...}] into {... ... ...}
    .reduce(assign)
    .value();
};

// Filter allowed actions on a given model
const isAllowedModel = function ({ model, action }) {
  // IDL property `def.actions` allows whitelisting specific actions
  return model.actions.includes(action.name);
};


module.exports = {
  getModelsByMethod,
};
