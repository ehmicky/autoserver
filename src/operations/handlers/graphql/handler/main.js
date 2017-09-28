'use strict';

const { getGraphQLDocument } = require('./document');
const { getMainDef } = require('./main_def');
const { parseOperationDef } = require('./definition');
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
  } = getGraphQLDocument({ queryVars, payload });

  const {
    mainDef,
    fragments,
  } = getMainDef({ queryDocument, operationName, method });

  const operationDef = parseOperationDef({ mainDef, fragments, variables });

  // Introspection GraphQL query
  if (isIntrospectionQuery({ operationDef })) {
    return handleIntrospection({
      schema,
      queryDocument,
      variables,
      operationName,
    });
  }

  return { operationDef };
};

module.exports = {
  handler,
};
