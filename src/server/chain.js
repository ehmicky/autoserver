'use strict';


const { chain, branch } = require('../chain');

const middleware = require('../middleware');
const { EngineError } = require('../error');


const start = chain([

  /**
   * Protocol-related middleware
   */
  // The first middleware (not present here) is the error handler, which sends final response, if errors
  branch(middleware.protocolNegotiator, {
    http: [
      // Sends final response, if success
      middleware.httpSendResponse,
      // Retrieves input.path
      middleware.httpGetPath,
    ],
  }),
  // Retrieves input.route, using input.path
  middleware.router,
  // Retrieves request parameters
  branch(middleware.protocolNegotiator, {
    http: [
      // General request log
      middleware.httpLogger,
      // Merge request parameters and payload into protocol-agnostic format
      middleware.httpFillParams,
    ],
  }),

  /**
   * Interface-related middleware
   */
  // Translates interface-specific calls into generic instance calls
  branch(middleware.interfaceNegotiator, {
    // GraphQL engine
    graphql: middleware.executeGraphql,
    // GraphQL debugger web app
    graphiql: middleware.executeGraphiql,
  }),

  // If we got there, it means no response has been fired
  function () {
    throw new EngineError('No middleware was able to handle the request', { reason: 'NO_RESPONSE' });
  },

]);


module.exports = {
  start,
};