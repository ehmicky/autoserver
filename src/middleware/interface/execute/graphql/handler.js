'use strict';


const { parseQuery } = require('./parse');
const { getHandleQuery } = require('./query');
const {
  isIntrospectionQuery,
  getHandleIntrospection,
} = require('./introspection');
const { applyModifiers } = require('./modifiers');


// GraphQL query handling
const executeGraphql = function (opts) {
  const { idl } = opts;
  const handleIntrospection = getHandleIntrospection(opts);
  const handleQuery = getHandleQuery({ idl });
  return async function executeGraphql(input) {
    // Parameters can be in either query variables or payload
    // (including by using application/graphql)
    const { queryVars, payload, method } = input;
    const {
      query,
      variables,
      operationName,
    } = Object.assign({}, queryVars, payload);

    // GraphQL parsing
    const {
      queryDocument,
      graphqlMethod,
    } = parseQuery({ query, method, operationName });

    // GraphQL execution
    let content;
    const modifiers = {};
    // Introspection GraphQL query
    if (isIntrospectionQuery({ query })) {
      content = await handleIntrospection({
        queryDocument,
        variables,
        operationName,
      });
    // Normal GraphQL query
    } else {
      const callback = fireNext.bind(this, input, modifiers);
      const response = await handleQuery({
        queryDocument,
        variables,
        operationName,
        context: { graphqlMethod, callback },
        rootValue: {},
      });
      const data = applyModifiers({ response, modifiers });
      content = { data };
    }

    const type = getResponseType({ content });

    const response = { content, type };
    return response;
  };
};

const fireNext = async function (request, modifiers, actionInput) {
  const input = Object.assign({}, request, { modifiers }, actionInput);
  const response = await this.next(input);
  return response;
};

const getResponseType = function ({ content: { data } }) {
  const mainData = data[Object.keys(data)[0]];
  return mainData instanceof Array ? 'collection' : 'model';
};


module.exports = {
  executeGraphql,
};
