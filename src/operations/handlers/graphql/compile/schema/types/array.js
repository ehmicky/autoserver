'use strict';

const { GraphQLList } = require('graphql');

const graphQLArrayTest = function (def) {
  // Already wrapped in Array type
  if (def.arrayWrapped) { return false; }

  if (def.model) {
    return def.action && def.action.multiple;
  }

  return def.isArray;
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
