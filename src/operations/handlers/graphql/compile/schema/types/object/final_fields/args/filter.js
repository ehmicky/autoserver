'use strict';

const { GraphQLNonNull } = require('graphql');

// `filter` argument
const getFilterArgument = function (def, opts) {
  const hasFilter = filterCommandTypes.includes(def.command.type);
  if (!hasFilter) { return {}; }

  const type = getFilterObjectType(def, opts);
  return getFilterArgs({ type });
};

const filterCommandTypes = ['find', 'delete', 'patch'];

const getFilterObjectType = function ({ command }, { filterObjectType }) {
  if (command.multiple) {
    return filterObjectType;
  }

  return new GraphQLNonNull(filterObjectType);
};

const getFilterArgs = ({ type }) => ({
  filter: {
    type,
    description: 'Filter results according to those attributes',
  },
});

module.exports = {
  getFilterArgument,
};
