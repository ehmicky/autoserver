'use strict';

const { GraphQLNonNull, GraphQLList } = require('graphql');

// `data` argument
const getDataArgument = function (def, opts) {
  // Only for mutation commands, but not delete
  const hasData = dataCommandTypes.includes(def.command.type);
  if (!hasData) { return {}; }

  const type = getDataObjectType(def, opts);

  // Retrieves description before wrapping in modifers
  const { description } = type;

  return { data: { type, description } };
};

const getDataObjectType = function ({ command }, { dataObjectType }) {
  // Add required and array modifiers
  const type = new GraphQLNonNull(dataObjectType);

  // Only multiple with createMany or replaceMany
  const isMultiple = command.multiple &&
    multipleDataCommandTypes.includes(command.type);

  if (isMultiple) {
    return new GraphQLNonNull(new GraphQLList(type));
  }

  return type;
};

const dataCommandTypes = ['create', 'replace', 'patch'];
const multipleDataCommandTypes = ['create', 'replace'];

module.exports = {
  getDataArgument,
};
