'use strict';


const { chain, branch } = require('../chain');
const middlewares = require('../middleware');
const { mapAsync } = require('../utilities');


const start = async function (opts) {
  const mdw = await applyMiddlewares(opts, middlewares);

  return chain([

    // Retrieves timestamp
    mdw.getTimestamp,

    /**
     * Protocol-related middleware
     **/
    // Pick the protocol
    mdw.protocolNegotiator,
    // The first middleware (not present here) is the error handler,
    // which sends final response, if errors
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
     **/
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
     * Conversion to API format
     **/
    // Convert from interface format to API format
    mdw.apiConvertor,
    // Basic validation layer
    mdw.basicValidation,

    /**
     * Middleware transforming one request into 0, 1 or several
     * separate requests
     **/
    // Split "update" action into "find" then "update"
    mdw.updateAction,

    /**
     * Normalization-related middleware
     **/
    // Apply system-defined default values, e.g. order_by 'id+'
    mdw.systemDefaults,
    // Apply user-defined default values
    mdw.userDefaults,
    // Normalize input
    mdw.normalization,
    // Only keep minimal attributes in delete response
    mdw.cleanDelete,

    /**
     * Generic API-related middleware
     **/
    // Pagination, which can spawn one or several requests
    mdw.pagination,
    // Process transforms
    mdw.transform,
    // Parse filter's JSL, e.g. convert to format processable by database
    mdw.handleFilter,

    /**
     * Validation-related middleware
     **/
    // General validation layer
    mdw.validation,

    /**
     * Database-related middleware
     **/
    // Do the database action, protocol and interface-agnostic
    mdw.executeDatabaseAction,

    /**
     * Catch-all error middleware
     **/
    mdw.noResponse,

  ]);
};

// Apply options
const applyMiddlewares = async function (opts, middlewares) {
  return await mapAsync(middlewares, applyMiddleware.bind(null, opts));
};
const applyMiddleware = async function (opts, middleware) {
  return await middleware(opts);
};

module.exports = {
  start,
};
