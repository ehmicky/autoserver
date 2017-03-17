'use strict';


const { chain, branch } = require('../middleware');

const protocol = require('../protocol');
const interfac = require('../interface');


const start = chain([

  /**
   * Protocol layer
   */
  // Sends final response
  branch(protocol.negotiator, {
    http: protocol.httpSendResponse,
  }),
  // Retrieves input.path
  branch(protocol.negotiator, {
    http: protocol.httpGetPath,
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