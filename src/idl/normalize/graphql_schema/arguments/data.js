'use strict';


const { GraphQLNonNull, GraphQLList } = require('graphql');


// Data argument, i.e. payload used by mutation actions
const dataActionTypes = ['create', 'upsert', 'replace', 'update'];
const multipleDataActionTypes = ['create', 'upsert', 'replace'];
const getDataArgument = function ({ action = {}, dataObjectType }) {
  // Only for mutation actions, but not delete
  if (!dataActionTypes.includes(action.type)) { return; }

  // Retrieves description before wrapping in modifers
  const description = dataObjectType.description;

  // Add required and array modifiers
  dataObjectType = new GraphQLNonNull(dataObjectType);
  // Only multiple with createMany or upsertMany or replaceMany
  if (action.multiple && multipleDataActionTypes.includes(action.type)) {
    dataObjectType = new GraphQLNonNull(new GraphQLList(dataObjectType));
  }

  return {
    data: {
      type: dataObjectType,
      description,
    },
  };
};


module.exports = {
  getDataArgument,
};
