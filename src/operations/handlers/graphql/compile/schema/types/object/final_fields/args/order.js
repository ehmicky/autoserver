'use strict';

const { GraphQLString } = require('graphql');

// `order` argument
const getOrderArgument = function ({ command, features }) {
  const canOrder = ORDER_COMMAND_TYPES.includes(command.type) &&
    command.multiple &&
    features.includes('order');
  if (!canOrder) { return {}; }

  return ORDER_ARGS;
};

const ORDER_COMMAND_TYPES = ['find'];

const ORDER_ARGS = {
  order: {
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
