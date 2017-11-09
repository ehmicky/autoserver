'use strict';

const { capitalize } = require('underscore.string');

const {
  assignObject,
  mapValues,
  mapKeys,
} = require('../../../../../utilities');
const { COMMANDS } = require('../../../../../constants');

const { getCommandName, getTypeName } = require('./name');
const { TOP_DESCRIPTIONS, getCommandDescription } = require('./description');

// Retrieve the GraphQL definitions for Query|Mutation,
// and the top-level commands
const getTopDefs = function ({ models }) {
  return mapValues(
    GRAPHQL_METHODS,
    (commands, graphqlMethod) =>
      getTopDef({ graphqlMethod, commands, models })
  );
};

// Mapping from schema commands to GraphQL methods
const GRAPHQL_METHODS = {
  query: ['find'],
  mutation: ['create', 'upsert', 'patch', 'delete'],
};

const getTopDef = function ({ models, graphqlMethod, commands }) {
  const attributes = getCommandsDefs({ models, commands });
  const model = capitalize(graphqlMethod);
  const description = TOP_DESCRIPTIONS[graphqlMethod];

  const topDef = { type: 'object', attributes, model, description };
  return topDef;
};

// Retrieve attributes for a given GraphQL method
const getCommandsDefs = function ({ models, commands }) {
  return COMMANDS
    .map(({ type }) => type)
    .filter(type => commands.includes(type))
    .map(command => getCommandDef({ models, command }))
    .reduce(assignObject, {});
};

// Retrieve attributes for a given command
const getCommandDef = function ({ models, command }) {
  // E.g. 'my_model' + 'findMany' -> 'findMyModels'
  // This will be used as the top-level graphqlMethod
  const modelsA = mapKeys(
    models,
    (model, modelname) => getCommandName({ model: modelname, command }),
  );
  const modelsB = mapValues(
    modelsA,
    model => normalizeModelDef({ model, command }),
  );
  return modelsB;
};

// Add command information to each top-level model
const normalizeModelDef = function ({ model, command }) {
  const typeName = getTypeName({ def: model });
  const commandDescription = getCommandDescription({ command, typeName });

  return { ...model, command, commandDescription, type: 'object' };
};

module.exports = {
  getTopDefs,
};
