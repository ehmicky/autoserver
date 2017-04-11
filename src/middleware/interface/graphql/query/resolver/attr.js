'use strict';


// Resolver for non-model, i.e. for simple attributes
const attrResolver = function ({ attrName, parent }) {
  return parent[attrName];
};


module.exports = {
  attrResolver,
};
