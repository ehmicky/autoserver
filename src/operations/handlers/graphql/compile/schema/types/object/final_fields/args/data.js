'use strict';

const { GraphQLNonNull, GraphQLList } = require('graphql');

const { argTypesDescriptions } = require('../../../../description');

// `data` argument
const getDataArgument = function (def, opts) {
  // Only for mutation commands, but not delete
  const hasData = dataCommandTypes.includes(def.command.type);
  if (!hasData) { return {}; }

  const type = getDataObjectType(def, opts);
  const description = argTypesDescriptions.data[def.command.name];

  return { data: { type, description } };
};

const getDataObjectType = function ({ command }, { dataObjectType }) {
  // Only multiple with createMany or replaceMany
  const isMultiple = command.multiple &&
    multipleDataCommandTypes.includes(command.type);

  // Add required and array modifiers
  if (isMultiple) {
    return new GraphQLNonNull(new GraphQLList(dataObjectType));
  }

  return new GraphQLNonNull(dataObjectType);
};

const dataCommandTypes = ['create', 'replace', 'patch'];
const multipleDataCommandTypes = ['create', 'replace'];

module.exports = {
  getDataArgument,
};
