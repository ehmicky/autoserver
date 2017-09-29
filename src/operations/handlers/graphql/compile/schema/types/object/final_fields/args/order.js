'use strict';

const { GraphQLString } = require('graphql');

// `order_by` argument, i.e. used for sorting results
const getOrderArgument = function ({ def: { action } }) {
  // Only with findMany actions
  const canOrder = orderActionTypes.includes(action.type) && action.multiple;
  if (canOrder) { return {}; }

  return orderArgs;
};

const orderActionTypes = ['find'];

const orderArgs = {
  order_by: {
    type: GraphQLString,
    description: `Sort results according to this attribute.
Specify ascending or descending order by appending + or - (default is ascending)
Several attributes can specified, by using a comma-separated list.`,
    defaultValue: 'id+',
  },
};

module.exports = {
  getOrderArgument,
};
