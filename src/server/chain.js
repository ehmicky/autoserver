'use strict';


const { chain } = require('../chain');
const middlewares = require('../middleware');
const { mapAsync } = require('../utilities');


const start = async function (opts) {
  // Apply options
  const mdw = await mapAsync(middlewares, async mdw => await mdw(opts));

  return chain([

    /**
     * Protocol-related middleware
     **/
    // Error handler, which sends final response, if errors
    mdw.errorHandler,
    // Sets up protocol format
    mdw.protocolConvertor,
    // Pick the protocol
    mdw.protocolNegotiator,
    // Sends final response, if success
    mdw.sendResponse,
    // Retrieves timestamp
    mdw.getTimestamp,
    // Retrieves input.path
    mdw.getPath,
    // Retrieves IP
    mdw.getIp,
    // Merge request parameters and payload into protocol-agnostic format
    mdw.fillParams,
    // Retrieves input.route, using input.path
    mdw.router,
    // General request log
    mdw.logger,

    /**
     * Interface-related middleware
     **/
    // Convert from protocol format to interface format
    mdw.interfaceConvertor,
    // Pick the interface
    mdw.interfaceNegotiator,
    // Compile JSL helpers, variables, etc.
    mdw.wrapCustomJsl,
    // Translates interface-specific calls into generic instance actions
    mdw.executeInterface,

    /**
     * Middleware transforming one action into 0, 1 or several commands
     **/
    // Convert from interface format to API format
    mdw.apiConvertor,
    // Basic validation layer
    mdw.basicValidation,
    // Turn one action into 0, 1 or several commands
    mdw.executeAction,

    /**
     * Normalization-related middleware
     **/
    // Convert from API format to CRUD format
    mdw.crudConvertor,
    // CRUD basic validation layer
    mdw.crudBasicValidation,
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
    // Paginate output
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

  ])[0];
};


module.exports = {
  start,
};
