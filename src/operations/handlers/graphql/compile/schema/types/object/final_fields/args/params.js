'use strict';

const GraphQLJSON = require('graphql-type-json');

// `params` argument
const getParamsArgument = function () {
  return paramsArgs;
};

const paramsArgs = {
  params: {
    type: GraphQLJSON,
    description: 'Custom variables passed to database logic',
  },
};

module.exports = {
  getParamsArgument,
};
