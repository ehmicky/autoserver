'use strict';


const { chain, cloneDeep, merge, assign, mapValues } = require('lodash');

const { actions } = require('../../../../constants');
const { getActionName } = require('./name');
const { getSubDef, isModel, isMultiple } = require('./utilities');


// Mapping from IDL actions to GraphQL methods
const graphqlMethods = {
  query: ['find'],
  mutation: ['create', 'replace', 'update', 'upsert', 'delete'],
};

// Retrieve models for a given GraphQL method
const getModelsByGraphqlMethod = function ({ graphqlMethod, models }) {
  // Iterate through each action
  return chain(actions)
    // Only include actions for a given GraphQL method
    .filter(({ type }) => graphqlMethods[graphqlMethod].includes(type))
    // Iterate through each model
    .mapValues(action => chain(models)
      // Remove model that are not allowed for a given action
      .pickBy(model => isAllowedModel({ model, action }))
      // Modify object key to include action information,
      // e.g. 'my_model' + 'findMany' -> 'findMyModels'
      // This will be used as the top-level graphqlMethod
      .mapKeys((_, modelName) => getActionName({ modelName, action }))
      .mapValues(model => {
        // Deep copy
        let modelCopy = cloneDeep(model);

        // Add action information to the nested models
        const properties = mapValues(model.properties, def => {
          const subDef = getSubDef(def);
          if (!isModel(subDef)) { return def; }

          const multiple = isMultiple(def);
          const subAction = actions.find(act => {
            return act.type === action.type && act.multiple === multiple;
          });
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
  getModelsByGraphqlMethod,
};
