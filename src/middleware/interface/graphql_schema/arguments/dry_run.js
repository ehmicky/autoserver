'use strict';


const { GraphQLBoolean } = require('graphql');


// dry_run argument
const mutationActionTypes = ['delete', 'update', 'create', 'upsert', 'replace'];
const getDryRunArguments = function ({ action }) {
  // Only with *Many actions
  if (!mutationActionTypes.includes(action.type)) { return; }

  return {
    dry_run: {
      type: GraphQLBoolean,
      description: `If true, the action will not modify the database.
The return value will remain the same.`,
      defaultValue: false,
    },
  };
};


module.exports = {
  getDryRunArguments,
};
