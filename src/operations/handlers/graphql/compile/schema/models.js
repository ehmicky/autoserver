'use strict';

const {
  assignObject,
  mapValues,
  mapKeys,
} = require('../../../../../utilities');
const { COMMANDS } = require('../../../../../constants');

const { getModelFieldName } = require('./name');

// Retrieve attributes for a given GraphQL method
const getModelDefs = function ({ graphqlMethod, models }) {
  const commands = COMMANDS
    .filter(({ type }) => graphqlMethods[graphqlMethod].includes(type));
  const modelDefs = commands
    .map(command => getCommandModels({ models, command }))
    .reduce(assignObject, {});
  return modelDefs;
};

// Mapping from IDL commands to GraphQL methods
const graphqlMethods = {
  query: ['find'],
  mutation: ['create', 'replace', 'patch', 'delete'],
};

const getCommandModels = function ({ models, command }) {
  const modelsA = nameModelsCommands({ models, command });
  const modelsB = normalizeModelsDef({ models: modelsA, command });
  return modelsB;
};

// E.g. 'my_model' + 'findMany' -> 'findMyModels'
// This will be used as the top-level graphqlMethod
const nameModelsCommands = function ({ models, command }) {
  return mapKeys(
    models,
    (model, modelName) => getModelFieldName({ modelName, command }),
  );
};

// Add command information to each top-level model
const normalizeModelsDef = function ({ models, command }) {
  return mapValues(models, model => ({ ...model, command, type: 'object' }));
};

module.exports = {
  getModelDefs,
};
