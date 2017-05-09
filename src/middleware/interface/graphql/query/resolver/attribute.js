'use strict';


const { getParentModel, setParentModel } = require('./utilities');


// Resolver for normal attributes
const attributeResolver = function ({ parent, name }) {
  const directReturn = parent[name] === undefined ? null : parent[name];

  // Forward parent model to children
  const parentModel = getParentModel(parent);
  setParentModel(directReturn, Object.assign({}, parentModel, { nonNestedModel: true }));

  return { directReturn };
};


module.exports = {
  attributeResolver,
};
