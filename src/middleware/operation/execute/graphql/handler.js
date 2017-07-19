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
  // GraphQL execution
  const actions = [];
  const content = await getContent.call(this, { input, actions });
  const type = getResponseType({ content });

  makeImmutable(actions);
  const response = { content, type, actions };
  return response;
};

const getContent = async function ({
  input,
  input: { idl: { shortcuts: { modelsMap }, GraphQLSchema: schema } },
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
  const callback = fireNext.bind(this, { input, actions });
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

const fireNext = async function ({ input, actions }, actionInput) {
  const nextInput = Object.assign({}, input, actionInput);

  const response = await this.next(nextInput);

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
