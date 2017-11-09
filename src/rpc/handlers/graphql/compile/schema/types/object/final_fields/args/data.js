'use strict';

const { GraphQLNonNull, GraphQLList } = require('graphql');

const { getArgTypeDescription } = require('../../../../description');

// `data` argument
const getDataArgument = function (def, opts) {
  // Only for mutation commands, but not delete
  const hasData = DATA_COMMAND_TYPES.includes(def.command);
  if (!hasData) { return {}; }

  const type = getDataObjectType(def, opts);
  const description = getArgTypeDescription(def, 'argData');

  return { data: { type, description } };
};

const getDataObjectType = function ({ command }, { dataObjectType }) {
  // Only multiple with createMany or upsertMany
  const isMultiple = MANY_DATA_COMMAND_TYPES.includes(command);

  // Add required and array modifiers
  if (isMultiple) {
    return new GraphQLNonNull(new GraphQLList(dataObjectType));
  }

  return new GraphQLNonNull(dataObjectType);
};

const DATA_COMMAND_TYPES = ['create', 'upsert', 'patch'];
const MANY_DATA_COMMAND_TYPES = ['create', 'upsert'];

module.exports = {
  getDataArgument,
};
