'use strict';

const { GraphQLString } = require('graphql');

// `order_by` argument, i.e. used for sorting results
const getOrderArgument = function ({ def: { action } }) {
  // Only with *Many actions
  if (!action.multiple) { return {}; }

  return orderArgs;
};

const orderArgs = {
  order_by: {
    type: GraphQLString,
    description: `Sort results according to this attribute.
Specify ascending or descending order by appending + or - (default is ascending)`,
    defaultValue: 'id+',
  },
};

module.exports = {
  getOrderArgument,
};
