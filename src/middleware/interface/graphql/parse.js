'use strict';


const { parse } = require('graphql');

const { EngineError } = require('../../../error');
const { memoize } = require('../../../utilities');


// Raw GraphQL parsing
const parseQuery = memoize(function ({ query }) {
  if (!query) {
    throw new EngineError('Missing GraphQL query', { reason: 'GRAPHQL_NO_QUERY' });
  }

  try {
    const queryDocument = parse(query);
    return { queryDocument };
  } catch (innererror) {
    throw new EngineError('Could not parse GraphQL query', { reason: 'GRAPHQL_SYNTAX_ERROR', innererror });
  }
});


module.exports = {
  parseQuery,
};
