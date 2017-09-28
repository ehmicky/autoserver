'use strict';

const { getGraphQLInput } = require('./input');
const { getMainDef } = require('./main_def');
const { parseOperation } = require('./operation');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');

const handler = function ({
  idl: { GraphQLSchema: schema },
  queryVars,
  payload,
  method,
}) {
  const {
    variables,
    operationName,
    queryDocument,
  } = getGraphQLInput({ queryVars, payload });

  const {
    mainDef,
    fragments,
  } = getMainDef({ queryDocument, operationName, method });

  const operation = parseOperation({ mainDef, fragments, variables });

  // Introspection GraphQL query
  if (isIntrospectionQuery({ operation })) {
    return handleIntrospection({
      schema,
      queryDocument,
      variables,
      operationName,
    });
  }

  return { operation };
};

module.exports = {
  handler,
};
