// eslint-disable-next-line max-lines, eslint-comments/no-unused-disable
'use strict';

const final = require('./final');
const time = require('./time');
const protocol = require('./protocol');
const operation = require('./operation');
const action = require('./action');
const sequencer = require('./sequencer');
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
    name: 'time',
    layers: [
      // Add request timestamp
      time.addTimestamp,
      // Abort request after a certain delay
      time.setRequestTimeout,
      // Sets how long processing the request took
      time.setResponseTime,
    ],
  },

  {
    name: 'protocol',
    layers: [
      // Protocol-related validation middleware
      protocol.protocolValidation,
      // Set protocol full name
      protocol.getProtocolName,
      // Sets requestId, serverId, serverName
      protocol.setRequestIds,
      // Retrieves IP
      protocol.getIp,
      // Parse URL and path into protocol-agnostic format
      protocol.parseUrl,
      // Retrieves mInput.operation, using mInput.path
      protocol.router,
      // Parse protocol method into protocol-agnostic format
      protocol.parseMethod,
      // Parse URL query string into protocol-agnostic format
      protocol.parseQueryString,
      // Parse request payload into protocol-agnostic format
      protocol.parsePayload,
      // Parse headers into protocol-agnostic format
      protocol.parseHeaders,
      // Parse protocol-specified arguments
      protocol.parseProtocolArgs,

      // Fires operation layer
      protocol.fireOperation,
    ],
  },

  {
    name: 'operation',
    layers: [
      // Check if protocol method is allowed for current operation
      operation.methodCheck,
      // Fire operation-specific logic
      operation.operationExecute,

      // Fire action layer
      operation.fireActions,

      // Operation-related output validation middleware
      operation.operationValidationOut,
    ],
  },

  {
    name: 'action',
    layers: [
      action.actionHandling,
    ],
  },

  {
    name: 'sequencer',
    layers: [
      sequencer.sequenceActions,
    ],
  },

  {
    name: 'command',
    layers: [
      // Normalize empty values (undefined, null) by removing their key
      command.normalizeEmpty,
      // Apply attribute aliases, in mInput
      command.renameAliasesInput,
      // Resets readonly attributes in `args.newData`
      command.handleReadonly,
      // Process `attr.compute`, in input
      command.handleComputesIn,
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
      // Process `attr.compute`, in output
      command.handleComputesOut,
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
      // Transform command to `read` if `dryrun` settings is used
      database.applyDryRun,

      // Do the database action, protocol and operation-agnostic
      database.databaseExecute,

      // Add default empty response.metadata
      database.addMetadataDefault,
      // Validate database response
      database.responseValidation,
    ],
  },
];

module.exports = {
  middlewareLayers,
};
