'use strict';


const { chain, branch } = require('../middleware');

const protocol = require('../protocol');
const interfac = require('../interface');


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
    http: protocol.httpGetParams,
  }),
  // General request logging
  protocol.logger,

  /**
   * Interface layer
   */
  // Translates interface-specific calls into generic instance calls
  branch(interfac.negotiator, {
    graphql: interfac.executeGraphql,
    graphiql: interfac.executeGraphiql,
  }),

]);


module.exports = {
  start,
};