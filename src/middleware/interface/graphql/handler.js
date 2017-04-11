'use strict';


const { getHandleQuery } = require('./query');
const { EngineError } = require('../../../error');


// GraphQL query handling
const executeGraphql = async function (input) {
  const { idl } = input;
  const handleQuery = getHandleQuery({ idl });
  return async function (request) {
    // Parameters can be in either query variables or payload (including by using application/graphql)
    const { query, variables, operationName } = Object.assign({}, request.params, request.payload);

    if (!query) {
      throw new EngineError('Missing GraphQL query', { reason: 'GRAPHQL_NO_QUERY' });
    }

    const callback = fireNext.bind(this, input);
    const response = await handleQuery({
      query,
      variables,
      operationName,
      context: { callback },
      rootValue: {},
    });

    return {
      type: 'object',
      content: response,
    };
  };
};

const fireNext = async function (input, apiInput) {
  console.log('FIRE', apiInput);
  // TODO: remove this
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
