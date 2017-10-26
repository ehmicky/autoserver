'use strict';

const { GraphQLNonNull, GraphQLList } = require('graphql');

const { getArgTypeDescription } = require('../../../../description');

// `data` argument
const getDataArgument = function (def, opts) {
  // Only for mutation commands, but not delete
  const hasData = DATA_COMMAND_TYPES.includes(def.command.type);
  if (!hasData) { return {}; }

  const type = getDataObjectType(def, opts);
  const description = getArgTypeDescription(def, 'argData');

  return { data: { type, description } };
};

const getDataObjectType = function ({ command }, { dataObjectType }) {
  // Only multiple with createMany or replaceMany
  const isMultiple = command.multiple &&
    MANY_DATA_COMMAND_TYPES.includes(command.type);

  // Add required and array modifiers
  if (isMultiple) {
    return new GraphQLNonNull(new GraphQLList(dataObjectType));
  }

  return new GraphQLNonNull(dataObjectType);
};

const DATA_COMMAND_TYPES = ['create', 'replace', 'patch'];
const MANY_DATA_COMMAND_TYPES = ['create', 'replace'];

module.exports = {
  getDataArgument,
};
