'use strict';


// Resolver for normal attributes
const attributeResolver = function ({ parent, name }) {
  const directReturn = parent[name] === undefined ? null : parent[name];
  return { directReturn };
};


module.exports = {
  attributeResolver,
};
