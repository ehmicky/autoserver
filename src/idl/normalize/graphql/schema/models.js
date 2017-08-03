'use strict';

const { assignObject, mapValues, mapKeys } = require('../../../../utilities');
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
  // E.g. 'my_model' + 'findMany' -> 'findMyModels'
  // This will be used as the top-level graphqlMethod
  const renamedModels = mapKeys(models, (model, modelName) =>
    getPluralActionName({ modelName, action })
  );

  // Iterate through each model
  // Add action information to the top-level model
  return mapValues(renamedModels, model => ({
    ...model,
    isTopLevel: true,
    action,
    multiple: action.multiple,
    type: 'object',
    validate: {},
  }));
};

module.exports = {
  getModelsByGraphqlMethod,
};
