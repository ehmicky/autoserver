'use strict';

const {
  assignObject,
  mapValues,
  mapKeys,
} = require('../../../../../utilities');
const { COMMANDS } = require('../../../../../constants');

const { getCommandName, getTypeName } = require('./name');

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
    model => normalizeModelDef({ model, command }),
  );
};

const normalizeModelDef = function ({ model, command }) {
  const typeName = getTypeName({ def: model });
  const description = descriptions[command.name]({ typeName });

  return {
    ...model,
    command,
    description,
    type: 'object',
  };
};

// Top-level action description
const descriptions = {
  findOne: ({ typeName }) => `Search for a '${typeName}' model`,
  findMany: ({ typeName }) => `Search for '${typeName}' models`,
  createOne: ({ typeName }) => `Create a '${typeName}' model`,
  createMany: ({ typeName }) => `Create '${typeName}' models`,
  replaceOne: ({ typeName }) => `Fully update a '${typeName}' model`,
  replaceMany: ({ typeName }) => `Fully update '${typeName}' models`,
  patchOne: ({ typeName }) => `Partially update a '${typeName}' model`,
  patchMany: ({ typeName }) => `Partially update '${typeName}' models`,
  deleteOne: ({ typeName }) => `Delete a '${typeName}' model`,
  deleteMany: ({ typeName }) => `Delete '${typeName}' models`,
};

module.exports = {
  getTopDefs,
};
