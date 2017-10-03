'use strict';

const { GraphQLList } = require('graphql');

const graphQLArrayTest = function ({ arrayWrapped, command, isArray }) {
  // Already wrapped in Array type
  if (arrayWrapped) { return false; }

  if (command !== undefined) {
    return command.multiple;
  }

  return isArray;
};

// Array field TGetter
const graphQLArrayTGetter = function (def, opts) {
  const defA = { ...def, arrayWrapped: true };
  const subType = opts.getType(defA, opts);
  const type = new GraphQLList(subType);
  return type;
};

module.exports = {
  graphQLArrayTest,
  graphQLArrayTGetter,
};
