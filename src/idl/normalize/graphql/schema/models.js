'use strict';

const { difference } = require('lodash');

const {
  assignObject,
  mapValues,
  mapKeys,
  pickBy,
  deepMerge,
} = require('../../../../utilities');
const { ACTIONS } = require('../../../../constants');

const { getPluralActionName } = require('./name');

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
    .map(action => getAllModelsByAction({ models, action }))
    .reduce(assignObject, {});
};

const getAllModelsByAction = function ({ models, action }) {
  // Remove model that are not allowed for a given action
  const allowedModels = pickBy(models, model =>
    isAllowedModel({ model, action })
  );

  // E.g. 'my_model' + 'findMany' -> 'findMyModels'
  // This will be used as the top-level graphqlMethod
  const renamedModels = mapKeys(allowedModels, (model, modelName) =>
    getPluralActionName({ modelName, action })
  );

  // Iterate through each model
  return mapValues(renamedModels, model =>
    getModelByAction({ model, action })
  );
};

// Filter allowed actions on a given model
const isAllowedModel = function ({ model: { commands }, action }) {
  const actions = ACTIONS
    .filter(({ commandNames }) =>
      difference(commandNames, commands).length === 0
    )
    .map(({ name }) => name);
  return actions.includes(action.name);
};

const getModelByAction = function ({ model, action }) {
  // Add action information to the nested models
  const properties = mapValues(
    model.properties,
    def => getModelProps({ def, action }),
  );

  const modelCopy = deepMerge(model, { properties, isTopLevel: true });

  // Add action information to the top-level model
  return {
    ...modelCopy,
    action,
    type: 'object',
    validate: {},
    multiple: action.multiple,
  };
};

const getModelProps = function ({ def, action }) {
  if (def.target === undefined) { return def; }

  const subAction = ACTIONS.find(act =>
    act.type === action.type && act.multiple === def.multiple
  );
  return { ...def, action: subAction };
};

module.exports = {
  getModelsByGraphqlMethod,
};
