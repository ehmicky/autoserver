'use strict';


const { chain, branch } = require('../chain');

const middleware = require('../middleware');
const { EngineError } = require('../error');


const start = function (opts) {
  const mdw = applyOptions(opts);
  return chain([

    /**
     * Protocol-related middleware
     */
    // The first middleware (not present here) is the error handler, which sends final response, if errors
    branch(mdw.protocolNegotiator, {
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
    branch(mdw.protocolNegotiator, {
      http: [
        // General request log
        mdw.httpLogger,
        // Merge request parameters and payload into protocol-agnostic format
        mdw.httpFillParams,
      ],
    }),
    // Convert from protocol format to interface format
    mdw.interfaceConvertor,

    /**
     * Interface-related middleware
     */
    // Translates interface-specific calls into generic instance calls
    branch(mdw.interfaceNegotiator, {
      // GraphQL engine
      graphql: mdw.executeGraphql,
      // GraphQL debugger web app
      graphiql: mdw.executeGraphiql,
    }),

    // Do the database query, protocol and interface-agnostic
    mdw.queryDatabase,

    // If we got there, it means no response has been fired
    function () {
      throw new EngineError('No middleware was able to handle the request', { reason: 'NO_RESPONSE' });
    },

  ]);
};

const applyOptions = function (opts) {
  return [
    'protocolNegotiator',
    'httpSendResponse',
    'httpGetPath',
    'router',
    'httpLogger',
    'httpFillParams',
    'interfaceConvertor',
    'interfaceNegotiator',
    'executeGraphql',
    'executeGraphiql',
    'queryDatabase'
  ].reduce((memo, name) => {
    memo[name] = middleware[name](opts);
    return memo;
  }, {});
};

module.exports = {
  start,
};