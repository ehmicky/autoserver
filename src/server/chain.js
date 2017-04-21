'use strict';


const { chain, branch } = require('../chain');

const middleware = require('../middleware');
const { EngineError } = require('../error');


const start = async function (opts) {
  const mdw = await applyOptions(opts);
  return chain([

    /**
     * Protocol-related middleware
     */
    // Pick the protocol
    mdw.protocolNegotiator,
    // The first middleware (not present here) is the error handler, which sends final response, if errors
    branch(mdw.protocolNegotiation, {
      http: [
        // Sends final response, if success
        mdw.httpSendResponse,
        // Retrieves input.path
        mdw.httpGetPath,
      ],
    }),
    // Retrieves input.route, using input.path
    mdw.router,
    // Retrieves request parameters
    branch(mdw.protocolNegotiation, {
      http: [
        // General request log
        mdw.httpLogger,
        // Merge request parameters and payload into protocol-agnostic format
        mdw.httpFillParams,
      ],
    }),

    /**
     * Interface-related middleware
     */
    // Convert from protocol format to interface format
    mdw.interfaceConvertor,
    // Pick the interface
    mdw.interfaceNegotiator,
    // Translates interface-specific calls into generic instance calls
    branch(mdw.interfaceNegotiation, {
      // GraphQL engine
      graphql: mdw.executeGraphql,
      // GraphQL debugger web app
      graphiql: mdw.executeGraphiql,
      // GraphQL schema printing
      graphqlprint: mdw.printGraphql,
    }),

    /**
     * API-related middleware
     */
    // Convert from interface format to API format
    mdw.apiConvertor,
    // General validation layer
    mdw.validation,

    /**
     * Database-related middleware
     */
    // Do the database operation, protocol and interface-agnostic
    mdw.executeDatabaseOperation,

    // If we got there, it means no response has been fired
    function () {
      throw new EngineError('No middleware was able to handle the request', { reason: 'WRONG_RESPONSE' });
    },

  ]);
};

const applyOptions = async function (opts) {
  const middlewares = [
    'protocolNegotiator',
    'protocolNegotiation',
    'httpSendResponse',
    'httpGetPath',
    'router',
    'httpLogger',
    'httpFillParams',
    'interfaceConvertor',
    'interfaceNegotiator',
    'interfaceNegotiation',
    'executeGraphql',
    'executeGraphiql',
    'printGraphql',
    'apiConvertor',
    'validation',
    'executeDatabaseOperation'
  ];
  const memo = {};
  for (const name of middlewares) {
    memo[name] = await middleware[name](opts);
  }
  return memo;
};

module.exports = {
  start,
};
