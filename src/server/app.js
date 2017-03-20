'use strict';


const { chain, branch } = require('../middleware');

const protocol = require('../protocol');
const interf = require('../interface');
const { MiddlewareError } = require('../error');


const start = chain([

  /**
   * Protocol layer
   */
  // The first layer (not present here) is the error handler, which sends final response, if errors
  branch(protocol.negotiator, {
    http: [
      // Sends final response, if success
      protocol.httpSendResponse,
      // Retrieves input.path
      protocol.httpGetPath,
    ],
  }),
  // Retrieves input.route, using input.path
  protocol.router,
  // Retrieves request parameters
  branch(protocol.negotiator, {
    http: [
      protocol.logger,
      protocol.httpGetParams,
    ],
  }),

  /**
   * Interface layer
   */
  // Translates interface-specific calls into generic instance calls
  branch(interf.negotiator, {
    graphql: interf.executeGraphql,
    graphiql: interf.executeGraphiql,
  }),

  // If we got there, it means no response has been fired
  function () {
    throw new MiddlewareError('No middleware was able to handle the request', { reason: 'NO_RESPONSE' });
  },

]);


module.exports = {
  start,
};