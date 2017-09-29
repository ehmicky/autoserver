'use strict';

const {
  assignObject,
  mapValues,
  mapKeys,
} = require('../../../../../utilities');
const { ACTIONS } = require('../../../../../constants');

const { getModelFieldName } = require('./name');

// Retrieve attributes for a given GraphQL method
const getModelDefs = function ({ graphqlMethod, models }) {
  const actions = ACTIONS
    .filter(({ type }) => graphqlMethods[graphqlMethod].includes(type));
  const modelDefs = actions
    .map(action => getActionModels({ models, action }))
    .reduce(assignObject, {});
  return modelDefs;
};

// Mapping from IDL actions to GraphQL methods
const graphqlMethods = {
  query: ['find'],
  mutation: ['create', 'replace', 'update', 'delete'],
};

const getActionModels = function ({ models, action }) {
  const modelsA = nameModelsActions({ models, action });
  const modelsB = normalizeModelsDef({ models: modelsA, action });
  return modelsB;
};

// E.g. 'my_model' + 'findMany' -> 'findMyModels'
// This will be used as the top-level graphqlMethod
const nameModelsActions = function ({ models, action }) {
  return mapKeys(models, (model, modelName) =>
    getModelFieldName({ modelName, action })
  );
};

// Add action information to each top-level model
const normalizeModelsDef = function ({ models, action }) {
  return mapValues(models, model => ({ ...model, action, type: 'object' }));
};

module.exports = {
  getModelDefs,
};
