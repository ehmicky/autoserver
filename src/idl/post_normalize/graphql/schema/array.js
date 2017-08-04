'use strict';

const { GraphQLList } = require('graphql');

// Array field TGetter
const graphQLArrayTGetter = function (def, opts) {
  const defA = { ...def, arrayWrapped: true };
  const subType = opts.getType(defA, opts);
  const type = new GraphQLList(subType);
  return type;
};

module.exports = {
  graphQLArrayTGetter,
};
