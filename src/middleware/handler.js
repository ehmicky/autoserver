'use strict';

const { getMiddlewarePerf } = require('../perf');

const { chain } = require('./chain');
const initial = require('./initial');
const protocol = require('./protocol');
const operation = require('./operation');
const action = require('./action');
const command = require('./command');
const database = require('./database');

const middleware = [

  // Initial layer

  // Setup basic input
  initial.setupInput,
  // Error handler, which sends final response, if errors
  initial.errorHandler,
  // Emit event about how the request handling takes
  initial.performanceEvent,
  // Emit "call" events
  initial.callEvents,

  // Protocol layer

  // Sets up Protocol format
  protocol.protocolConvertor,
  // Protocol-related validation middleware
  protocol.protocolValidation,
  // Sends final response, if success
  protocol.sendResponse,
  // Sets response status
  protocol.getStatus,
  // Sets how long it took to handle request before responding it
  protocol.setResponseTime,
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

  // Operation layer

  // Convert from Protocol format to Operation format
  operation.operationConvertor,
  // Pick the operation
  operation.operationNegotiator,
  // Operation-related validation middleware
  operation.operationValidation,
  // Remove response data if settings silent is specified
  operation.silent,
  // Translates operation-specific calls into generic instance actions
  operation.operationExecute,

  // Action layer

  // Convert from Operation format to Action format
  action.actionConvertor,
  // Action-related validation middleware
  action.actionValidation,
  // Process client arguments
  action.handleArgs,
  // Turn one action into 0, 1 or several commands
  action.actionExecute,
  // Normalize empty values (undefined, null) by removing their key
  action.normalizeEmpty,

  // Command layer

  // Convert from Action format to Command format
  command.commandConvertor,
  // Command-related validation middleware
  command.commandValidation,
  // Normalize input
  command.normalization,
  // Apply attribute aliases
  command.renameAliases,
  // Resets readonly attributes in `args.newData`
  command.handleReadonly,
  // Process transforms
  command.handleTransforms,
  // Apply user-defined default values
  command.userDefaults,
  // Apply system-defined default values, e.g. order_by 'id+'
  command.systemDefaults,
  // Paginate output
  command.pagination,

  // Database layer

  // Convert from Command format to Database format
  database.databaseConvertor,
  // Authorization middleware
  database.authorization,
  // Custom data validation middleware
  database.dataValidation,
  // Do the database action, protocol and operation-agnostic
  database.databaseExecute,
];

const getMiddleware = function () {
  return chain(
    middleware,
    {
      before: [
        getMiddlewarePerf,
      ],
    },
  )[0];
};

module.exports = {
  getMiddleware,
};
