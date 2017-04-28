'use strict';


const { chain, branch } = require('../chain');

const middleware = require('../middleware');
const { EngineError } = require('../error');


const start = async function (opts) {
  const mdw = await applyOptions(opts);
  return chain([

    // Retrieves timestamp
    mdw.getTimestamp,

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
        // Retrieves IP
        mdw.httpGetIp,
      ],
    }),
    // Retrieves request parameters
    branch(mdw.protocolNegotiation, {
      http: [
        // General request log
        mdw.httpLogger,
        // Merge request parameters and payload into protocol-agnostic format
        mdw.httpFillParams,
      ],
    }),
    // Retrieves input.route, using input.path
    mdw.router,

    /**
     * Interface-related middleware
     */
    // Convert from protocol format to interface format
    mdw.interfaceConvertor,
    // Pick the interface
    mdw.interfaceNegotiator,
    // Compile JSL helpers, variables, etc.
    mdw.wrapCustomJsl,
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
    // Only keep minimal attributes in delete response
    mdw.cleanDelete,
    // Validate schema.readOnly
    mdw.validateReadOnly,
    // Process transforms and default values
    mdw.transform,
    // Parse filter's JSL, e.g. convert to format processable by database
    mdw.handleFilter,
    // General validation layer
    mdw.validation,

    /**
     * Database-related middleware
     */
    // Do the database action, protocol and interface-agnostic
    mdw.executeDatabaseAction,

    // If we got there, it means no response has been fired
    function () {
      throw new EngineError('No middleware was able to handle the request', { reason: 'WRONG_RESPONSE' });
    },

  ]);
};

const applyOptions = async function (opts) {
  const middlewares = [
    'getTimestamp',
    'protocolNegotiator',
    'protocolNegotiation',
    'httpSendResponse',
    'httpGetPath',
    'httpGetIp',
    'router',
    'httpLogger',
    'httpFillParams',
    'interfaceConvertor',
    'interfaceNegotiator',
    'interfaceNegotiation',
    'wrapCustomJsl',
    'executeGraphql',
    'executeGraphiql',
    'printGraphql',
    'validateReadOnly',
    'transform',
    'apiConvertor',
    'cleanDelete',
    'handleFilter',
    'validation',
    'executeDatabaseAction'
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
