'use strict';

const {
  assignObject,
  mapValues,
  mapKeys,
} = require('../../../../../utilities');
const { COMMANDS } = require('../../../../../constants');

const { getCommandName } = require('./name');

const getTopDefs = function ({ models }) {
  return mapValues(topDefsInit, getTopDef.bind(null, models));
};

const topDefsInit = {
  query: {
    type: 'object',
    description: 'Fetches models',
    model: 'Query',
  },
  mutation: {
    type: 'object',
    description: 'Modifies models',
    model: 'Mutation',
  },
};

const getTopDef = function (models, topDef, graphqlMethod) {
  const attributes = getModelDefs({ graphqlMethod, models });
  return { ...topDef, attributes };
};

// Retrieve attributes for a given GraphQL method
const getModelDefs = function ({ graphqlMethod, models }) {
  return COMMANDS
    .filter(({ type }) => graphqlMethods[graphqlMethod].includes(type))
    .map(command => getCommandModels({ models, command }))
    .reduce(assignObject, {});
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
    (model, modelName) => getCommandName({ model: modelName, command }),
  );
};

// Add command information to each top-level model
const normalizeModelsDef = function ({ models, command }) {
  return mapValues(
    models,
    model => ({ ...model, command, type: 'object' }),
  );
};

module.exports = {
  getTopDefs,
};
