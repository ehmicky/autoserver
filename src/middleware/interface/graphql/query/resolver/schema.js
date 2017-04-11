'use strict';


// Resolver for introspection queries, i.e. `__schema`
const schemaResolver = function ({ schema }) {
  return schema;
};


module.exports = {
  schemaResolver,
};
