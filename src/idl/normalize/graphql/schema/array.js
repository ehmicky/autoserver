'use strict';

const { GraphQLList } = require('graphql');

// Array field FGetter
const graphQLArrayFGetter = function (def, opts, getField) {
  const defA = { ...def, multiple: false };
  const { type: subType, args } = getField(defA, opts);
  const type = new GraphQLList(subType);
  return { type, args };
};

module.exports = {
  graphQLArrayFGetter,
};
