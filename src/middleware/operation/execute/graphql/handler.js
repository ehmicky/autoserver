'use strict';

const { makeImmutable } = require('../../../../utilities');

const { parseQuery } = require('./parse');
const { handleQuery } = require('./query');
const { getResolver } = require('./resolver');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');

// GraphQL query handling
const executeGraphql = async function (input) {
  const { log } = input;
  const perf = log.perf.start('operation.executeGraphql', 'middleware');

  // GraphQL execution
  const actions = [];
  const content = await getContent.call(this, { input, perf, actions });
  const type = getResponseType({ content });

  makeImmutable(actions);
  perf.stop();
  const response = { content, type, actions };
  return response;
};

const getContent = async function ({
  input,
  input: { idl: { shortcuts: { modelsMap }, GraphQLSchema: schema } },
  perf,
  actions,
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
    return content;
  }

  // Normal GraphQL query
  const resolver = getResolver.bind(null, modelsMap);
  const callback = fireNext.bind(this, { input, perf, actions });
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

const getGraphQLInput = function ({ input: { queryVars, payload, goal } }) {
  // Parameters can be in either query variables or payload
  // (including by using application/graphql)
  const {
    query,
    variables,
    operationName,
  } = Object.assign({}, queryVars, payload);

  // GraphQL parsing
  const {
    queryDocument,
    graphqlMethod,
  } = parseQuery({ query, goal, operationName });

  return { query, variables, operationName, queryDocument, graphqlMethod };
};

const fireNext = async function ({ input, perf, actions }, actionInput) {
  const nextInput = Object.assign({}, input, actionInput);

  // Several calls of this function are done concurrently, so we stop
  // performance recording on the first in, and restart on the last out
  perf.ongoing = perf.ongoing || 0;

  if (perf.ongoing === 0) {
    perf.stop();
  }

  perf.ongoing += 1;

  const response = await this.next(nextInput);

  perf.ongoing -= 1;

  if (perf.ongoing === 0) {
    perf.start();
  }

  actions.push(response.action);

  return response;
};

const getResponseType = function ({ content: { data } }) {
  const mainData = data[Object.keys(data)[0]];
  return Array.isArray(mainData) ? 'collection' : 'model';
};

module.exports = {
  executeGraphql,
};
