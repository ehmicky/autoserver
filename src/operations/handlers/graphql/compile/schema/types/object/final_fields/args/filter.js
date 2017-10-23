'use strict';

const { GraphQLNonNull } = require('graphql');

const { ARG_TYPES_DESCRIPTIONS } = require('../../../../description');

// `filter` argument
const getFilterArgument = function (def, opts) {
  const hasFilter = FILTER_COMMAND_TYPES.includes(def.command.type);
  if (!hasFilter) { return {}; }

  const type = getFilterObjectType(def, opts);
  const description = ARG_TYPES_DESCRIPTIONS.filter[def.command.name];

  return { filter: { type, description } };
};

const FILTER_COMMAND_TYPES = ['find', 'delete', 'patch'];

const getFilterObjectType = function ({ command }, { filterObjectType }) {
  if (command.multiple) {
    return filterObjectType;
  }

  return new GraphQLNonNull(filterObjectType);
};

module.exports = {
  getFilterArgument,
};
