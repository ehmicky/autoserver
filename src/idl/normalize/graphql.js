'use strict';


const { getSchema } = require('./graphql_schema');

// Add GraphQL schema, both as AST and as HTML output
const normalizeGraphQL = function ({ idl, serverOpts }) {
  const GraphQLSchema = getSchema({ idl, serverOpts });

  Object.assign(idl, { GraphQLSchema });
  return idl;
};


module.exports = {
  normalizeGraphQL,
};
