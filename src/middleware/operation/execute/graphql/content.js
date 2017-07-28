'use strict';

const { stopPerf, restartPerf } = require('../../../../perf');

const { parseQuery } = require('./parse');
const { handleQuery } = require('./query');
const { getResolver } = require('./resolver');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');

const getContent = async function ({
  nextFunc,
  input,
  input: { idl: { shortcuts: { modelsMap }, GraphQLSchema: schema } },
  actions,
  measures,
  logs,
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
    nextFunc,
    input,
    actions,
    measures,
    logs,
  });

  // This middleware spurs several children in parallel.
  // We need to manually call the performance monitoring functions to make
  // them work
  const stoppedMeasure = stopPerf(input.currentPerf);
  const data = await handleQuery({
    resolver,
    queryDocument,
    variables,
    operationName,
    context: { graphqlMethod, callback },
    rootValue: {},
  });
  const currentPerf = restartPerf(stoppedMeasure);

  return [{ data }, currentPerf];
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

const fireNext = async function (
  { nextFunc, input, actions, measures, logs },
  actionInput,
) {
  const inputA = { ...input, ...actionInput };

  const response = await nextFunc(inputA);

  actions.push(response.action);
  measures.push(...response.measures);
  logs.push(response.log);

  return response;
};

module.exports = {
  getContent,
};
