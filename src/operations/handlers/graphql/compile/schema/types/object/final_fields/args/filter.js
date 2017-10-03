'use strict';

const { GraphQLNonNull } = require('graphql');

const getFilterArgument = function ({ def: { command }, filterObjectType }) {
  // Nested queries for findOne|deleteOne|patchOne do not use filters,
  // as it is implied from parent return value
  const hasFilter = filterCommandTypes.includes(command.type);
  if (!hasFilter) { return {}; }

  const type = command.multiple
    ? filterObjectType
    : new GraphQLNonNull(filterObjectType);
  return getFilterArgs({ type });
};

// Filters argument, i.e. only queries entities that match specified attributes
const filterCommandTypes = ['find', 'delete', 'patch'];

const getFilterArgs = ({ type }) => ({
  filter: {
    type,
    description: 'Filter results according to those attributes',
  },
});

module.exports = {
  getFilterArgument,
};
