'use strict';

const { GraphQLNonNull } = require('graphql');

const { argTypesDescriptions } = require('../../../../description');

// `filter` argument
const getFilterArgument = function (def, opts) {
  const hasFilter = filterCommandTypes.includes(def.command.type);
  if (!hasFilter) { return {}; }

  const type = getFilterObjectType(def, opts);
  const description = argTypesDescriptions.filter[def.command.name];

  return { filter: { type, description } };
};

const filterCommandTypes = ['find', 'delete', 'patch'];

const getFilterObjectType = function ({ command }, { filterObjectType }) {
  if (command.multiple) {
    return filterObjectType;
  }

  return new GraphQLNonNull(filterObjectType);
};

module.exports = {
  getFilterArgument,
};
