'use strict';


const { parse } = require('graphql');

const { EngineError } = require('../../../../error');
const { memoize } = require('../../../../utilities');


// Raw GraphQL parsing
const parseQuery = memoize(function ({ query }) {
  try {
    const queryDocument = parse(query);
    return { queryDocument };
  } catch ({ message }) {
    throw new EngineError(`Could not parse GraphQL query: ${message}`, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }
});


module.exports = {
  parseQuery,
};
