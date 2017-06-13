'use strict';


const { cloneDeep, merge, mapValues } = require('lodash');

const { assignObject, map } = require('../../../../utilities');
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
  // Only include actions for a given GraphQL method
  const graphqlActions = actions
    .filter(({ type }) => graphqlMethods[graphqlMethod].includes(type));

  // Iterate through each action
  return graphqlActions
    // Iterate through each model
    .map(action => {
      return Object.entries(models)
        // Remove model that are not allowed for a given action
        .filter(([, model]) => isAllowedModel({ model, action }))
        .map(([modelName, model]) => {
          // E.g. 'my_model' + 'findMany' -> 'findMyModels'
          // This will be used as the top-level graphqlMethod
          const actionName = getActionName({ modelName, action });

          // Add action information to the nested models
          const properties = map(model.properties, def => {
            const subDef = getSubDef(def);
            if (!isModel(subDef)) { return def; }

            const multiple = isMultiple(def);
            const subAction = actions.find(act => {
              return act.type === action.type && act.multiple === multiple;
            });
            return Object.assign({}, def, { action: subAction });
          });

          let modelCopy = cloneDeep(model);
          merge(modelCopy, { properties, isTopLevel: true });

          // Wrap in array if action is multiple
          if (action.multiple) {
            modelCopy = { type: 'array', items: modelCopy };
          }

          // Add action information to the top-level model
          Object.assign(modelCopy, { action });

          return [actionName, modelCopy];
        })
        .reduce(assignObject, {});
    })
    .reduce(assignObject, {});
};

// Filter allowed actions on a given model
const isAllowedModel = function ({ model, action }) {
  // IDL property `def.actions` allows whitelisting specific actions
  return model.actions.includes(action.name);
};


module.exports = {
  getModelsByGraphqlMethod,
};
