'use strict';

const { getParentModel, setParentModel } = require('./utilities');

// Resolver for normal attributes
const attributeResolver = function ({ parent, name }) {
  const directReturn = parent[name] === undefined ? null : parent[name];

  // Forward parent model to children
  const parentModel = getParentModel(parent);
  const parentModelInfo = { ...parentModel, nonNestedModel: true };
  setParentModel(directReturn, parentModelInfo);

  return { directReturn };
};

module.exports = {
  attributeResolver,
};
