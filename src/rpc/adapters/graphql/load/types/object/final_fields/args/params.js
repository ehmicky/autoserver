'use strict';

const GraphQLJSON = require('graphql-type-json');

// `params` argument
const getParamsArgument = function () {
  return PARAMS_ARGS;
};

const PARAMS_ARGS = {
  params: {
    type: GraphQLJSON,
    description: 'Custom parameters passed to database logic',
  },
};

module.exports = {
  getParamsArgument,
};
