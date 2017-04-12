'use strict';


const { forwardParentModel } = require('./utilities');


// Resolver for non-model, i.e. for simple attributes
const attrResolver = function ({ name, parent }) {
  const response = parent[name];
  // For object attributes, so they keep track of current parent model
  forwardParentModel(parent, response, name);
  return response;
};


module.exports = {
  attrResolver,
};
