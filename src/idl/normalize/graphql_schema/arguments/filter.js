'use strict';

const { GraphQLNonNull } = require('graphql');

// Filters argument, i.e. only queries entities that match specified attributes
const filterActionTypes = ['find', 'delete', 'update'];

const getFilterArgument = function ({ def, action = {}, filterObjectType }) {
  // Nested queries for findOne|deleteOne|updateOne do not use filters, as it is implied from parent return value
  if (!filterActionTypes.includes(action.type) || (!def.isTopLevel && !action.multiple)) { return; }
  const type = action.multiple ? filterObjectType : new GraphQLNonNull(filterObjectType);
  return {
    filter: {
      type,
      description: 'Filter results according to those attributes',
    },
  };
};

module.exports = {
  getFilterArgument,
};
