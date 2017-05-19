'use strict';


const { chain } = require('../chain');
const middlewares = require('../middleware');
const { mapAsync } = require('../utilities');


const startChain = async function (opts) {
  // Apply options
  const mdw = await mapAsync(middlewares, async mdw => await mdw(opts));

  const allMiddlewares = chain([
    // Error handler, which sends final response, if errors
    mdw.errorHandler,

    /**
     * Protocol-related middleware
     **/
    // Sets up protocol format
    mdw.protocolConvertor,
    // Pick the protocol
    mdw.protocolNegotiator,
    // Add protocol-specific attributes to thrown exceptions
    mdw.protocolErrorHandler,
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
    // Add interface-specific attributes to thrown exceptions
    mdw.interfaceErrorHandler,
    // Compile JSL helpers, variables, etc.
    mdw.wrapCustomJsl,
    // Translates interface-specific calls into generic instance actions
    mdw.executeInterface,

    /**
     * Action-related middleware
     **/
    // Convert from interface format to Action format
    mdw.actionConvertor,
    // Action-related validation layer
    mdw.actionValidation,
    // Add action-specific attributes to thrown exceptions
    mdw.actionErrorHandler,
    // Turn one action into 0, 1 or several commands
    mdw.executeAction,

    /**
     * Normalization-related middleware
     **/
    // Convert from Action format to CRUD format
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
  ]);

  return allMiddlewares[0];
};


module.exports = {
  startChain,
};
