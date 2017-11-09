'use strict';

const { GraphQLList } = require('graphql');

const graphqlArrayTest = function ({ arrayWrapped, command, isArray }) {
  // Already wrapped in Array type
  if (arrayWrapped) { return false; }

  // Nested models' attributes
  if (isArray !== undefined) {
    return isArray;
  }

  // Top-level commands
  if (command !== undefined) {
    return true;
  }

  // Query|Mutation types
  return false;
};

// Array field TGetter
const graphqlArrayTGetter = function (def, opts) {
  const defA = { ...def, arrayWrapped: true };
  const subType = opts.getType(defA, opts);
  const type = new GraphQLList(subType);
  return type;
};

module.exports = {
  graphqlArrayTest,
  graphqlArrayTGetter,
};
