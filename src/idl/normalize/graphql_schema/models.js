'use strict';

const { cloneDeep, merge } = require('lodash');

const {
  assignObject,
  mapValues,
  mapKeys,
  pickBy,
} = require('../../../utilities');
const { ACTIONS } = require('../../../constants');

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
  const actions = ACTIONS
    .filter(({ type }) => graphqlMethods[graphqlMethod].includes(type));

  // Iterate through each action
  return actions
    .map(action => {
      // Remove model that are not allowed for a given action
      const allowedModels = pickBy(models, model =>
        isAllowedModel({ model, action })
      );

      // E.g. 'my_model' + 'findMany' -> 'findMyModels'
      // This will be used as the top-level graphqlMethod
      const renamedModels = mapKeys(allowedModels, modelName =>
        getActionName({ modelName, action })
      );

      // Iterate through each model
      return mapValues(renamedModels, model =>
        getModelByAction({ model, action })
      );
    })
    .reduce(assignObject, {});
};

const getModelByAction = function ({ model, action }) {
  // Add action information to the nested models
  const properties = mapValues(model.properties, def => {
    const subDef = getSubDef(def);
    if (!isModel(subDef)) { return def; }

    const multiple = isMultiple(def);
    const subAction = ACTIONS.find(act =>
      act.type === action.type && act.multiple === multiple
    );
    return Object.assign({}, def, { action: subAction });
  });

  const modelCopy = getModelCopy({ model, properties, action });
  // Add action information to the top-level model
  Object.assign(modelCopy, { action });

  return modelCopy;
};

const getModelCopy = function ({ model, properties, action: { multiple } }) {
  const modelCopy = cloneDeep(model);
  merge(modelCopy, { properties, isTopLevel: true });

  // Wrap in array if action is multiple
  return multiple ? { type: 'array', items: modelCopy } : modelCopy;
};

// Filter allowed actions on a given model
const isAllowedModel = function ({ model, action }) {
  // IDL property `def.actions` allows whitelisting specific actions
  return model.actions.includes(action.name);
};

module.exports = {
  getModelsByGraphqlMethod,
};
