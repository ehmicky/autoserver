'use strict';


const { parseQuery } = require('./parse');
const { getHandleQuery } = require('./query');
const { isIntrospectionQuery, getHandleIntrospection } = require('./introspection');


// GraphQL query handling
const executeGraphql = async function (input) {
  const { idl } = input;
  const handleQuery = getHandleQuery({ idl });
  const handleIntrospection = getHandleIntrospection({ idl });
  return async function (request) {
    // Parameters can be in either query variables or payload (including by using application/graphql)
    const { query, variables, operationName } = Object.assign({}, request.params, request.payload);

    // GraphQL parsing
    const { queryDocument } = parseQuery({ query });

    // GraphQL execution
    let response;
    // Introspection GraphQL query
    if (isIntrospectionQuery({ query })) {
      response = await handleIntrospection({ queryDocument, variables, operationName });
    // Normal GraphQL query
    } else {
      const callback = fireNext.bind(this, input);
      response = await handleQuery({ queryDocument, variables, operationName, context: { callback }, rootValue: {} });
    }

    return {
      type: 'object',
      content: response,
    };
  };
};

const fireNext = async function (input, apiInput) {
  // Rename `filter` to `filters`, as `filter` can be confused with Array.prototype.filter
  if (apiInput && apiInput.args && apiInput.args.filter) {
    apiInput.args.filters = apiInput.args.filter;
    delete apiInput.args.filter;
  }

  input.api = apiInput;
  const response = await this.next(input);
  return response;
};


module.exports = {
  executeGraphql,
};
