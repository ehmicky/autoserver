'use strict';

const final = require('./final');
const { setRequestTimeout } = require('./timeout');
const protocol = require('./protocol');
const operation = require('./operation');
const action = require('./action');
const command = require('./command');
const database = require('./database');

const middlewareLayers = [
  // Final layer, always fired, whether the request fails or not
  {
    name: 'final',
    layers: [
      // Sets response status
      final.getStatus,
      // Sends final response, if success
      final.sendResponse,
      // Emit "call" events
      final.callEvent,
      // Emit event about how long the request handling takes
      final.perfEvent,
    ],
  },

  {
    name: 'timeout',
    layers: [
      // Abort request after a certain delay
      setRequestTimeout,
    ],
  },

  {
    name: 'protocol',
    layers: [
      // Protocol-related validation middleware
      protocol.protocolValidation,
      // Add request timestamp
      protocol.addTimestamp,
      // Set protocol full name
      protocol.getProtocolName,
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
      // Parse operation-wide settings
      protocol.parseSettings,
      // Parse application-specific headers
      protocol.parseParams,
      // Retrieves mInput.route, using mInput.path
      protocol.router,

      // Fires operation layer
      protocol.fireOperation,

      // Sets how long processing the request took
      protocol.setResponseTime,
    ],
  },

  {
    name: 'operation',
    layers: [
      // Pick the operation
      operation.operationNegotiator,
      // Operation-related mInput validation middleware
      operation.operationValidationIn,

      // Translates operation-specific calls into generic instance actions
      operation.operationExecute,

      // Remove response data if settings silent is specified
      operation.silent,
      // Operation-related output validation middleware
      operation.operationValidationOut,
    ],
  },

  {
    name: 'action',
    layers: [
      // Action-related validation middleware
      action.actionValidation,
      // Process client arguments
      action.handleArgs,

      // Turn one action into 0, 1 or several commands
      action.actionExecute,

      // Transform response according to action-specific logic
      action.normalizeAction,
    ],
  },

  {
    name: 'command',
    layers: [
      // Normalize empty values (undefined, null) by removing their key
      command.normalizeEmpty,
      // Command-related validation middleware
      command.commandValidation,
      // Normalize mInput
      command.normalization,
      // Apply attribute aliases, in mInput
      command.renameAliasesInput,
      // Resets readonly attributes in `args.newData`
      command.handleReadonly,
      // Process `attr.transforms` and `attr.value`
      command.handleTransforms,
      // Apply user-defined default values
      command.userDefaults,
      // Apply system-defined default values, e.g. order_by 'id+'
      command.systemDefaults,
      // Paginate mInput
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
  },

  {
    name: 'database',
    layers: [
      // Authorization middleware
      database.authorization,
      // Custom data validation middleware
      database.dataValidation,
      // Do the database action, protocol and operation-agnostic
      database.databaseExecute,
    ],
  },
];

module.exports = {
  middlewareLayers,
};
