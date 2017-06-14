'use strict';


const { parseQuery } = require('./parse');
const { getHandleQuery } = require('./query');
const {
  isIntrospectionQuery,
  getHandleIntrospection,
} = require('./introspection');


// GraphQL query handling
const executeGraphql = function ({ idl, serverOpts }) {
  const handleIntrospection = getHandleIntrospection({ idl, serverOpts });
  const handleQuery = getHandleQuery({ idl });

  return async function executeGraphql(input) {
    // Parameters can be in either query variables or payload
    // (including by using application/graphql)
    const { queryVars, payload, goal, log } = input;
    const perf = log.perf.start('operation.executeGraphql', 'middleware');

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

    // GraphQL execution
    let content;
    const actions = [];
    // Introspection GraphQL query
    if (isIntrospectionQuery({ query })) {
      content = await handleIntrospection({
        queryDocument,
        variables,
        operationName,
      });
    // Normal GraphQL query
    } else {
      const callback = fireNext.bind(this, input, perf, actions);
      const data = await handleQuery({
        queryDocument,
        variables,
        operationName,
        context: { graphqlMethod, callback },
        rootValue: {},
      });
      content = { data };
    }

    const type = getResponseType({ content });

    perf.stop();
    const response = { content, type, actions };
    return response;
  };
};

const fireNext = async function (request, perf, actions, actionInput) {
  const input = Object.assign({}, request, actionInput);

  // Several calls of this function are done concurrently, so we stop
  // performance recording on the first in, and restart on the last out
  perf.ongoing = perf.ongoing || 0;
  if (perf.ongoing === 0) {
    perf.stop();
  }
  ++perf.ongoing;

  const response = await this.next(input);

  --perf.ongoing;
  if (perf.ongoing === 0) {
    perf.start();
  }

  actions.push(response.action);

  return response;
};

const getResponseType = function ({ content: { data } }) {
  const mainData = data[Object.keys(data)[0]];
  return mainData instanceof Array ? 'collection' : 'model';
};


module.exports = {
  executeGraphql,
};
