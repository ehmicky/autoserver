'use strict';

const { GraphQLList } = require('graphql');

const { getSubDef } = require('./utilities');

// Array field FGetter
const graphQLArrayFGetter = function (def, opts, getField) {
  const subDef = getSubDef(def);
  const { type: subType, args } = getField(subDef, opts);
  const type = new GraphQLList(subType);
  return { type, args };
};

module.exports = {
  graphQLArrayFGetter,
};
