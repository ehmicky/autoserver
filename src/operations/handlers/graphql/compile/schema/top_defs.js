'use strict';

const { capitalize } = require('underscore.string');

const {
  assignObject,
  mapValues,
  mapKeys,
} = require('../../../../../utilities');
const { COMMANDS } = require('../../../../../constants');

const { getCommandName, getTypeName } = require('./name');
const { topDescriptions, commandDescriptions } = require('./description');

// Retrieve the GraphQL definitions for Query|Mutation,
// and the top-level commands
const getTopDefs = function ({ models }) {
  return Object.entries(graphqlMethods)
    .map(([graphqlMethod, commands]) =>
      getTopDef({ graphqlMethod, commands, models }))
    .reduce(assignObject, {});
};

// Mapping from schema commands to GraphQL methods
const graphqlMethods = {
  query: ['find'],
  mutation: ['create', 'replace', 'patch', 'delete'],
};

const getTopDef = function ({ models, graphqlMethod, commands }) {
  const attributes = getModelDefs({ commands, models });
  const model = capitalize(graphqlMethod);
  const description = topDescriptions[graphqlMethod];

  const topDef = { type: 'object', attributes, model, description };
  return { [graphqlMethod]: topDef };
};

// Retrieve attributes for a given GraphQL method
const getModelDefs = function ({ models, commands }) {
  return COMMANDS
    .filter(({ type }) => commands.includes(type))
    .map(command => getCommandModels({ models, command }))
    .reduce(assignObject, {});
};

// Retrieve top-level commands
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
    (model, modelName) => getCommandName({ model: modelName, command }),
  );
};

// Add command information to each top-level model
const normalizeModelsDef = function ({ models, command }) {
  return mapValues(
    models,
    model => normalizeModelDef({ model, command }),
  );
};

const normalizeModelDef = function ({ model, command }) {
  const typeName = getTypeName({ def: model });
  const commandDescription = commandDescriptions[command.name]({ typeName });

  return { ...model, command, commandDescription, type: 'object' };
};

module.exports = {
  getTopDefs,
};
