'use strict';


const { chain } = require('../chain');
const middlewares = require('../middleware');
const { mapAsync } = require('../utilities');


const startChain = async function (opts) {
  // Apply options
  const mdw = await mapAsync(middlewares, async mdw => await mdw(opts));

  const allMiddlewares = chain([
    /**
     * Catch-all error handler
     **/
    // Error handler, which sends final response, if errors
    mdw.errorHandler,

    /**
     * Protocol layer
     **/
    // Sets up Protocol format
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
     * Interface layer
     **/
    // Convert from Protocol format to Interface format
    mdw.interfaceConvertor,
    // Pick the interface
    mdw.interfaceNegotiator,
    // Add interface-specific attributes to thrown exceptions
    mdw.interfaceErrorHandler,
    // Translates interface-specific calls into generic instance actions
    mdw.interfaceExecute,

    /**
     * Action layer
     **/
    // Convert from Interface format to Action format
    mdw.actionConvertor,
    // Action-related validation layer
    mdw.actionValidation,
    // Add action-specific attributes to thrown exceptions
    mdw.actionErrorHandler,
    // Turn one action into 0, 1 or several commands
    mdw.actionExecute,

    /**
     * Command layer, for normalization
     **/
    // Convert from Action format to Command format
    mdw.commandConvertor,
    // Command-related validation layer
    mdw.commandValidation,
    // Add Command-specific attributes to thrown exceptions
    mdw.commandErrorHandler,
    // Apply system-defined default values, e.g. order_by 'id+'
    mdw.systemDefaults,
    // Apply user-defined default values
    mdw.userDefaults,
    // Normalize input
    mdw.normalization,
    // Only keep minimal attributes in delete response
    mdw.cleanDelete,
    // Process transforms
    mdw.transform,

    /**
     * API layer, for preparing database action
     **/
    // Convert from Command format to Api format
    mdw.apiConvertor,
    // Paginate output
    mdw.pagination,

    /**
     * Database layer
     **/
    // Convert from Api format to Database format
    mdw.databaseConvertor,
    // General validation layer
    mdw.validation,
    // Do the database action, protocol and interface-agnostic
    mdw.databaseExecute,

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
