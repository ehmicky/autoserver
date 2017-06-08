'use strict';


const { GraphQLBoolean } = require('graphql');


// no_output argument
const defaultTrueActionTypes = ['delete'];
const getNoOutputArguments = function ({ action }) {
  const defaultValue = defaultTrueActionTypes.includes(action.type)
    ? true
    : false;
  return {
    no_output: {
      type: GraphQLBoolean,
      description: `If true, the action will be performed but not return any value.
This can speed up the response, e.g. by reducing bandwidth.`,
      defaultValue,
    },
  };
};


module.exports = {
  getNoOutputArguments,
};
