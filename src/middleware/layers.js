/* eslint-disable max-lines */
'use strict';

const final = require('./final');
const time = require('./time');
const protocol = require('./protocol');
const operation = require('./operation');
const action = require('./action');
const sequencer = require('./sequencer');
const command = require('./command');
const database = require('./database');
const adapter = require('./adapter');

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
      // Parse protocol-specific arguments
      protocol.parseProtocolArgs,
      // Parse `args.params` specified as protocol header
      protocol.parseParamsArg,

      // Fires operation layer
      protocol.fireOperation,
    ],
  },

  {
    name: 'operation',
    layers: [
      // Check if protocol method is allowed for current operation
      operation.methodCheck,
      // Use operation-specific logic to parse the request into an
      // operation-agnostic `operationDef`
      operation.parseOperation,

      // Fire action layer
      operation.fireActions,
    ],
  },

  {
    name: 'action',
    layers: [
      // Parse a `operationDef` into a top-level action
      action.parseTopAction,
      // Turn `args.select` into a set of `actions`
      action.parseActions,
      // Add `action.command` and `action.modelName`
      action.parseModels,
      // Validate client-supplied args
      action.validateArgs,
      // Change arguments cases to camelCase
      action.renameArgs,
      // Parse `args.filter` and `args.id` into AST
      action.parseFilter,
      // Parse `args.data` into write `actions`
      action.parseDataArg,
      // Parse `args.cascade` into a set of delete nested `actions`
      action.parseCascade,
      // Parse `args.orderBy` from a string to an array of objects
      action.parseOrderBy,
      // Validate that attributes in `args.select|data|filter|order_by`
      // are in the schema
      action.validateUnknownAttrs,
      // Validate that attributes used in nested actions will not change
      action.validateStableIds,
      // Retrieves `operationSummary`, i.e. summary of all `actions`
      action.getOperationSummary,
      // Sort `actions` so that top-level ones are fired first
      action.sortActions,

      // Add `action.currentData`
      // and (for `patch|delete`) fix `action.dataPaths`
      action.addCurrentData,
      // Validate that readonly attributes are not modified by using
      // 'replace' nested actions
      action.validateNestedReadonly,
      // Merge `currentData` with the `args.data` in `patch` commands
      action.patchData,
      // Fire all write actions, retrieving some `results`
      action.resolveWriteActions,
      // Fire all read actions, retrieving some `results`
      action.resolveReadActions,

      // Remove nested `args.data` not present in `args.select`
      action.removeNestedWrite,
      // Remove duplicate `results` between read and write actions
      action.removeDuplicateResults,
      // Sort `results` so that top-level ones are processed first
      action.sortResults,
      // Add `modelsCount` and `uniqueModelsCount`
      action.getModelsCount,
      // Merge all `results` into a single nested response, using `result.path`
      action.assembleResults,
      // Applies `args.select`
      action.selectFields,
      // Add content type, and remove top-level key
      action.parseResponse,
      // Operation-related output validation middleware
      action.actionValidationOut,
    ],
  },

  {
    name: 'sequencer',
    layers: [
      // Fire one or several commands for a set of actions
      sequencer.sequenceActions,
    ],
  },

  {
    name: 'command',
    layers: [
      // Validate database supports command features
      command.validateFeatures,
      // Normalize empty values (undefined, null) by removing their key
      command.normalizeEmpty,
      // Apply attribute aliases, in mInput
      command.renameAliasesInput,
      // Process `attr.transforms` and `attr.value`
      command.handleTransforms,
      // Apply user-defined default values
      command.userDefaults,
      // Apply system-defined default values, e.g. order_by 'id+'
      command.systemDefaults,
      // Resets readonly attributes in `args.newData`
      command.handleReadonly,
      // Paginate mInput
      command.handlePaginationInput,

      // Fires database layer
      command.fireDatabase,

      // Paginate output
      command.handlePaginationOutput,
      // Apply attribute aliases, in output
      command.renameAliasesOutput,
    ],
  },

  {
    name: 'database',
    layers: [
      // Authorization middleware
      database.validateAuthorization,
      // Custom data validation middleware
      database.dataValidation,

      // Fires adapter layer
      database.fireAdapter,

      // Retrieves database return value
      database.getDbResponse,
      // Validate database response
      database.responseValidation,
      // Remove models that are null|undefined
      database.removeEmptyModels,
      // Remove duplicate read models
      database.duplicateReads,
      // Check if any `id` was not found (404) or was unauthorized (403)
      database.validateMissingIds,
      // Check if any model already exists, for create actions
      database.validateCreateIds,
    ],
  },

  {
    name: 'adapter',
    layers: [
      // Pick database adapter
      adapter.pickDatabaseAdapter,
      // Add database-specific id names
      adapter.renameIdsInput,

      // Do the database action, protocol and operation-agnostic
      adapter.databaseExecute,

      // Remove database-specific id names
      adapter.renameIdsOutput,
    ],
  },
];

module.exports = {
  middlewareLayers,
};
/* eslint-enable max-lines */
