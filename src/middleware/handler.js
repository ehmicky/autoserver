'use strict';

const { getChain } = require('./chain');
const initial = require('./initial');
const final = require('./final');
const protocol = require('./protocol');
const operation = require('./operation');
const action = require('./action');
const command = require('./command');
const database = require('./database');

const middleware = {
  main: [
    // Protocol layer
    [
      // Start the main performance counter
      initial.startMainPerf,
      // Protocol-related validation middleware
      protocol.protocolValidation,
      // Abort request after a certain delay
      protocol.setRequestTimeout,
      // Set protocol full name
      protocol.getProtocolName,
      // Retrieves timestamp
      protocol.getTimestamp,
      // Sets requestId, serverId, serverName
      protocol.setRequestIds,
      // Retrieves IP
      protocol.getIp,
      // Parse URL and path into protocol-agnostic format
      protocol.parseUrl,
      // Parse protocol method into protocol-agnostic format
      protocol.parseMethod,
      // Parse URL query string into protocol-agnostic format
      protocol.parseQueryString,
      // Parse request payload into protocol-agnostic format
      protocol.parsePayload,
      // Parse headers into protocol-agnostic format
      protocol.parseHeaders,
      // Parse operation-wide settings, and application-specific headers
      protocol.parseSettingsParams,
      // Retrieves input.route, using input.path
      protocol.router,

      // Fires operation layer
      protocol.fireOperation,

      // Sets how long it took to handle request before responding it
      protocol.setResponseTime,
      // Sets response status
      final.getStatus,
      // Sends final response, if success
      final.sendResponse,
      // Emit "call" events
      final.callEvent,
      // Emit event about how long the request handling takes
      final.perfEvent,
    ],

    // Operation layer
    [
      // Pick the operation
      operation.operationNegotiator,
      // Operation-related input validation middleware
      operation.operationValidationIn,

      // Translates operation-specific calls into generic instance actions
      operation.operationExecute,

      // Remove response data if settings silent is specified
      operation.silent,
      // Operation-related output validation middleware
      operation.operationValidationOut,
    ],

    // Action layer
    [
      // Add action-related input information
      action.addActionInputInfo,
      // Action-related validation middleware
      action.actionValidation,
      // Process client arguments
      action.handleArgs,

      // Turn one action into 0, 1 or several commands
      action.actionExecute,

      // Transform response according to action-specific logic
      action.normalizeAction,
      // Add action-related output information
      action.addActionOutputInfo,
    ],

    // Command layer
    [
      // Normalize empty values (undefined, null) by removing their key
      action.normalizeEmpty,
      // Add command-related information
      command.addCommandInfoIn,
      // Command-related validation middleware
      command.commandValidation,
      // Normalize input
      command.normalization,
      // Apply attribute aliases, in input
      command.renameAliasesInput,
      // Resets readonly attributes in `args.newData`
      command.handleReadonly,
      // Process `attr.transforms` and `attr.value`
      command.handleTransforms,
      // Apply user-defined default values
      command.userDefaults,
      // Apply system-defined default values, e.g. order_by 'id+'
      command.systemDefaults,
      // Paginate input
      command.handlePaginationInput,

      // Fires database layer
      command.fireDatabase,

      // Paginate output
      command.handlePaginationOutput,
      // Process `attr.compute`
      command.handleComputes,
      // Apply attribute aliases, in output
      command.renameAliasesOutput,
    ],

    // Database layer
    [
      // Authorization middleware
      database.authorization,
      // Custom data validation middleware
      database.dataValidation,
      // Do the database action, protocol and operation-agnostic
      database.databaseExecute,
    ],
  ],
};

const getMiddleware = function () {
  return getChain(middleware);
};

module.exports = {
  getMiddleware,
};
