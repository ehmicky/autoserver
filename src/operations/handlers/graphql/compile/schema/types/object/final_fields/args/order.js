'use strict';

const { GraphQLString } = require('graphql');

// `order_by` argument
const getOrderArgument = function ({ command }) {
  const canOrder = orderCommandTypes.includes(command.type) && command.multiple;
  if (!canOrder) { return {}; }

  return orderArgs;
};

const orderCommandTypes = ['find'];

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
