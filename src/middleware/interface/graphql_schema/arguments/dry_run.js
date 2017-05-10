'use strict';


const { GraphQLBoolean } = require('graphql');


// dry_run argument
const mutationActionTypes = ['delete', 'update', 'create', 'upsert', 'replace'];
const getDryRunArguments = function ({ action: { actionType } }) {
  // Only with *Many actions
  if (!mutationActionTypes.includes(actionType)) { return; }

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
