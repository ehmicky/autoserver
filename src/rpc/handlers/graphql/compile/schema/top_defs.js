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
const getTopDefs = function ({ collections }) {
  return mapValues(
    GRAPHQL_METHODS,
    (commands, graphqlMethod) =>
      getTopDef({ graphqlMethod, commands, collections })
  );
};

// Mapping from schema commands to GraphQL methods
const GRAPHQL_METHODS = {
  query: ['find'],
  mutation: ['create', 'upsert', 'patch', 'delete'],
};

const getTopDef = function ({ collections, graphqlMethod, commands }) {
  const attributes = getCommandsDefs({ collections, commands });
  const collname = capitalize(graphqlMethod);
  const description = TOP_DESCRIPTIONS[graphqlMethod];

  const topDef = { type: 'object', attributes, collname, description };
  return topDef;
};

// Retrieve attributes for a given GraphQL method
const getCommandsDefs = function ({ collections, commands }) {
  return COMMANDS
    .map(({ type }) => type)
    .filter(type => commands.includes(type))
    .map(command => getCommandDef({ collections, command }))
    .reduce(assignObject, {});
};

// Retrieve attributes for a given command
const getCommandDef = function ({ collections, command }) {
  // E.g. 'my_coll' + 'findMany' -> 'find_my_coll'
  // This will be used as the top-level graphqlMethod
  const collectionsA = mapKeys(
    collections,
    (coll, collname) => getCommandName({ collname, command }),
  );
  const collectionsB = mapValues(
    collectionsA,
    coll => normalizeCollDef({ coll, command }),
  );
  return collectionsB;
};

// Add command information to each top-level collection
const normalizeCollDef = function ({ coll, command }) {
  const typeName = getTypeName({ def: coll });
  const commandDescription = getCommandDescription({ command, typeName });

  return { ...coll, command, commandDescription, type: 'object' };
};

module.exports = {
  getTopDefs,
};
