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
      const content = await handleIntrospection({ queryDocument, variables, operationName });
      response = { content };
    // Normal GraphQL query
    } else {
      const callback = fireNext.bind(this, request);
      const output = await handleQuery({
        queryDocument,
        variables,
        operationName,
        context: { graphqlMethod, callback },
        rootValue: {},
      });
      response = normalizeResponse(output);
    }

    response.type = getResponseType({ response });

    return response;
  };
};

const fireNext = async function (request, apiInput) {
  const input = Object.assign({}, request, { api: apiInput });
  const response = await this.next(input);
  return response;
};

const normalizeResponse = function ({ data/*, metadata*/ }) {
  const response = {};
  // Wraps response in a `data` envelope
  response.content = { data };
  return response;
};

const getResponseType = function ({ response: { content: { data } } }) {
  const mainData = data[Object.keys(data)[0]];
  return mainData instanceof Array ? 'collection' : 'model';
};


module.exports = {
  executeGraphql,
};
