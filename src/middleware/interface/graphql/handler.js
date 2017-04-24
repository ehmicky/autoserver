'use strict';


const { parseQuery } = require('./parse');
const { getHandleQuery } = require('./query');
const { isIntrospectionQuery, getHandleIntrospection } = require('./introspection');


// GraphQL query handling
const executeGraphql = async function (opts) {
  const { idl } = opts;
  const handleIntrospection = getHandleIntrospection({ idl });
  const handleQuery = getHandleQuery({ idl });
  return async function (request) {
    // Parameters can be in either query variables or payload (including by using application/graphql)
    const { params, payload, method } = request;
    const { query, variables, operationName } = Object.assign({}, params, payload);

    // GraphQL parsing
    const { queryDocument, graphqlMethod } = parseQuery({ query, method, operationName });

    // GraphQL execution
    let response;
    // Introspection GraphQL query
    if (isIntrospectionQuery({ query })) {
      response = await handleIntrospection({ queryDocument, variables, operationName });
    // Normal GraphQL query
    } else {
      const callback = fireNext.bind(this, request);
      const data = await handleQuery({ queryDocument, variables, operationName, context: { graphqlMethod, callback },
      rootValue: {} });
      // Wraps response in a `data` envelope
      response = { data };
    }

    return {
      type: 'object',
      content: response,
    };
  };
};

const fireNext = async function (request, apiInput) {
  request.api = apiInput;
  const response = await this.next(request);
  return response;
};


module.exports = {
  executeGraphql,
};
