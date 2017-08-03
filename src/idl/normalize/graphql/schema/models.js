'use strict';

const { assignObject, mapValues, mapKeys } = require('../../../../utilities');
const { ACTIONS } = require('../../../../constants');

const { getPluralActionName } = require('./name');

// Retrieve attributes for a given GraphQL method
const getModelDefs = function ({ graphqlMethod, idl }) {
  return ACTIONS
    .filter(({ type }) => graphqlMethods[graphqlMethod].includes(type))
    .map(action => getActionModels({ idl, action }))
    .reduce(assignObject, {});
};

// Mapping from IDL actions to GraphQL methods
const graphqlMethods = {
  query: ['find'],
  mutation: ['create', 'replace', 'update', 'upsert', 'delete'],
};

const getActionModels = function ({ idl: { models }, action }) {
  const modelsA = nameModelsActions({ models, action });
  const modelsB = normalizeModelsDef({ models: modelsA, action });
  return modelsB;
};

// E.g. 'my_model' + 'findMany' -> 'findMyModels'
// This will be used as the top-level graphqlMethod
const nameModelsActions = function ({ models, action }) {
  return mapKeys(models, (model, modelName) =>
    getPluralActionName({ modelName, action })
  );
};

// Add action information to each top-level model
const normalizeModelsDef = function ({ models, action }) {
  return mapValues(models, model => normalizeModelDef({ model, action }));
};

const normalizeModelDef = function ({ model, action }) {
  return {
    ...model,
    type: 'object',
    name: model.model,
    action,
    multiple: action.multiple,
  };
};

module.exports = {
  getModelDefs,
};
