'use strict';


const { chain } = require('../chain');
const middlewares = require('../middleware');
const { mapAsync } = require('../utilities');


const start = async function (opts) {
  const mdw = await applyMiddlewares(opts, middlewares);

  return chain([

    /**
     * Protocol-related middleware
     **/
    // The first middleware (not present here) is the error handler,
    // which sends final response, if errors

    // Sets up protocol format
    mdw.protocolConvertor,
    // Pick the protocol
    mdw.protocolNegotiator,
    // Retrieves timestamp
    mdw.getTimestamp,
    // Sends final response, if success
    mdw.sendResponse,
    // Retrieves input.path
    mdw.getPath,
    // Retrieves IP
    mdw.getIp,
    // General request log
    mdw.logger,
    // Merge request parameters and payload into protocol-agnostic format
    mdw.fillParams,
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
    // Translates interface-specific calls into generic instance actions
    mdw.executeInterface,

    /**
     * Middleware transforming one action into 0, 1 or several commands
     **/
    // Convert from interface format to API format
    mdw.apiConvertor,
    // Basic validation layer
    mdw.basicValidation,
    // Turn "create" action into a "create" command
    mdw.createAction,
    // Turn "find" action into a "read" command
    mdw.findAction,
    // Split "update" action into "read" then "update" commands
    mdw.updateAction,
    // Split "upsert" action into "read", then "create" or "update"
    // commands, then a final "read" command
    mdw.upsertAction,
    // Turn "replace" action into an "update" command
    mdw.replaceAction,
    // Turn "delete" action into a "delete" command
    mdw.deleteAction,

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

  ]);
};

// Apply options
const applyMiddlewares = async function (opts, middlewares) {
  return await mapAsync(middlewares, async mdw => await mdw(opts));
};

module.exports = {
  start,
};
