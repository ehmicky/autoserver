'use strict';

const { GraphQLNonNull, GraphQLList } = require('graphql');

// Data argument, i.e. payload used by mutation actions
const dataActionTypes = ['create', 'replace', 'patch'];
const multipleDataActionTypes = ['create', 'replace'];

const getDataArgument = function ({ def: { action }, dataObjectType }) {
  // Only for mutation actions, but not delete
  if (!dataActionTypes.includes(action.type)) { return {}; }

  const type = getDataObjectType({ action, dataObjectType });

  // Retrieves description before wrapping in modifers
  const { description } = type;

  return { data: { type, description } };
};

const getDataObjectType = function ({ action, dataObjectType }) {
  // Add required and array modifiers
  const type = new GraphQLNonNull(dataObjectType);

  // Only multiple with createMany or replaceMany
  if (action.multiple && multipleDataActionTypes.includes(action.type)) {
    return new GraphQLNonNull(new GraphQLList(type));
  }

  return type;
};

module.exports = {
  getDataArgument,
};
