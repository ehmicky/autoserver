'use strict';

const { GraphQLNonNull, GraphQLList } = require('graphql');

// Data argument, i.e. payload used by mutation commands
const dataCommandTypes = ['create', 'replace', 'patch'];
const multipleDataCommandTypes = ['create', 'replace'];

const getDataArgument = function ({ def: { command }, dataObjectType }) {
  // Only for mutation commands, but not delete
  if (!dataCommandTypes.includes(command.type)) { return {}; }

  const type = getDataObjectType({ command, dataObjectType });

  // Retrieves description before wrapping in modifers
  const { description } = type;

  return { data: { type, description } };
};

const getDataObjectType = function ({ command, dataObjectType }) {
  // Add required and array modifiers
  const type = new GraphQLNonNull(dataObjectType);

  // Only multiple with createMany or replaceMany
  if (command.multiple && multipleDataCommandTypes.includes(command.type)) {
    return new GraphQLNonNull(new GraphQLList(type));
  }

  return type;
};

module.exports = {
  getDataArgument,
};
