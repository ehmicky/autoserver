'use strict';

const { parseQuery } = require('./parse');
const { handleQuery } = require('./query');
const { getResolver } = require('./resolver');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');

const getContent = async function ({
  nextLayer,
  input,
  input: { idl: { shortcuts: { modelsMap }, GraphQLSchema: schema } },
  responses,
}) {
  const {
    query,
    variables,
    operationName,
    queryDocument,
    graphqlMethod,
  } = getGraphQLInput({ input });

  // Introspection GraphQL query
  if (isIntrospectionQuery({ query })) {
    const content = await handleIntrospection({
      schema,
      queryDocument,
      variables,
      operationName,
    });
    return [content];
  }

  // Normal GraphQL query
  const resolver = getResolver.bind(null, modelsMap);
  const callback = fireNext.bind(null, {
    nextLayer,
    input,
    responses,
  });

  // This middleware spurs several children in parallel.
  // We need to manually call the performance monitoring functions to make
  // them work
  const data = await handleQuery({
    resolver,
    queryDocument,
    variables,
    operationName,
    context: { graphqlMethod, callback },
    rootValue: {},
  });

  return { data };
};

const getGraphQLInput = function ({
  input: { queryVars, payload = {}, goal },
}) {
  // Parameters can be in either query variables or payload
  // (including by using application/graphql)
  const { query, variables, operationName } = { ...queryVars, ...payload };

  // GraphQL parsing
  const {
    queryDocument,
    graphqlMethod,
  } = parseQuery({ query, goal, operationName });

  return { query, variables, operationName, queryDocument, graphqlMethod };
};

const fireNext = async function ({ nextLayer, input, responses }, actionInput) {
  const inputA = { ...input, ...actionInput };

  const inputB = await nextLayer(inputA);

  // eslint-disable-next-line fp/no-mutating-methods
  responses.push(inputB.response);

  return inputB.response;
};

module.exports = {
  getContent,
};
