/* eslint-disable max-lines */
'use strict';

const final = require('./final');
const time = require('./time');
const protocol = require('./protocol');
const rpc = require('./rpc');
const action = require('./action');
const sequencer = require('./sequencer');
const requestResponse = require('./request_response');
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
      time.setResponsetime,
    ],
  },

  {
    name: 'protocol',
    layers: [
      // Protocol-related validation middleware
      protocol.protocolValidation,
      // Sets requestid and serverid
      protocol.setRequestids,
      // Retrieves IP
      protocol.getIp,
      // Parse URL into protocol-agnostic format
      protocol.parseOrigin,
      // Parse URL query string into protocol-agnostic format
      protocol.parseQueryString,
      // Parse headers into protocol-agnostic format
      protocol.parseHeaders,
      // Parse protocol method into protocol-agnostic format
      protocol.parseMethod,
      // Parse path into protocol-agnostic format
      protocol.parsePath,
      // Parse protocol-specific input
      protocol.parseProtocolInput,
      // Parse format|charset arguments
      protocol.parseFormatCharset,
      // Parse request payload into protocol-agnostic format
      protocol.parsePayload,
      // Retrieves mInput.rpc, using mInput.path
      protocol.router,

      // Fires rpc layer
      protocol.fireRpc,
    ],
  },

  {
    name: 'rpc',
    layers: [
      // Check if protocol method is allowed for current rpc
      rpc.methodCheck,
      // Use rpc-specific logic to parse the request into an
      // rpc-agnostic `rpcDef`
      rpc.parseRpc,

      // Fire action layer
      rpc.fireActions,
    ],
  },

  {
    name: 'action',
    layers: [
      // Parse a `rpcDef` into a top-level action
      action.parseTopAction,
      // Validate client-supplied args
      action.validateArgs,
      // Change arguments cases to camelCase
      action.renameArgs,
      // Parse `args.filter` and `args.id` into AST
      action.parseFilter,
      // Parse `args.data` into write `actions`
      action.parseDataArg,
      // Parse `args.populate|cascade` into a set of nested `actions`
      action.parsePopulateCascade,
      // Parse `args.order` from a string to an array of objects
      action.parseOrder,
      // Parse `args.select` into a set of `actions`
      action.parseSelect,
      // Validate that attributes in `args.select|data|filter|order`
      // are in the schema
      action.validateUnknownAttrs,
      // Validate that attributes used in nested actions will not change
      action.validateStableIds,
      // Retrieves `summary`, i.e. summary of all `actions`
      action.getSummary,
      // Sort `actions` so that top-level ones are fired first
      action.sortActions,

      // Add `action.currentData`
      // and (for `patch|delete`) fix `action.dataPaths`
      action.addCurrentData,
      // Merge `currentData` with the `args.data` in `patch` commands
      action.patchData,
      // Fire all read or write actions, retrieving some `results`
      action.resolveActions,
      // Rollback write actions if any of them failed
      action.rollback,

      // Sort `results` so that top-level ones are processed first
      action.sortResults,
      // Add `modelscount` and `uniquecount`
      action.getModelscount,
      // Merge all `results` into a single nested response, using `result.path`
      action.assembleResults,
      // Applies `args.select`
      action.applySelect,
      // Add content type, and remove top-level key
      action.parseResponse,
      // Middleware for rpc-related output validation
      action.actionValidationOut,
    ],
  },

  {
    name: 'read',
    layers: [
      // Fire one or several read commands for a set of actions
      sequencer.sequenceRead,
      // Deep merge all results' metadata
      sequencer.mergeMetadata,
    ],
  },

  {
    name: 'write',
    layers: [
      // Fire one or several write commands for a set of actions
      sequencer.sequenceWrite,
      // Deep merge all results' metadata
      sequencer.mergeMetadata,
    ],
  },

  {
    name: 'request',
    layers: [
      // Normalize empty values (undefined, null) by removing their key
      requestResponse.normalizeEmpty,
      // Apply attribute aliases, in mInput
      requestResponse.renameAliasesInput,
      // Process `attr.value`
      requestResponse.handleValue,
      // Apply user-defined default values
      requestResponse.handleUserDefault,
      // Apply system-defined default values, e.g. order 'id+'
      requestResponse.systemDefaults,
      // Resets readonly attributes in `args.newData`
      requestResponse.handleReadonly,
      // Paginate mInput
      requestResponse.handlePaginationInput,
      // Authorization middleware
      requestResponse.validateAuthorization,
      // Validate database supports command features
      requestResponse.validateFeatures,
      // Custom data validation middleware
      requestResponse.dataValidation,
    ],
  },

  {
    name: 'database',
    layers: [
      // Pick database adapter
      database.pickDatabaseAdapter,
      // Add database-specific id names
      database.renameIdsInput,

      // Do the database action, protocol and rpc-agnostic
      database.databaseExecute,

      // Remove database-specific id names
      database.renameIdsOutput,
      // Retrieves database return value
      database.getDbResponse,
    ],
  },

  {
    name: 'response',
    layers: [
      // Validate database response
      requestResponse.responseValidation,
      // Remove models that are null|undefined
      requestResponse.removeEmptyModels,
      // Remove duplicate read models
      requestResponse.duplicateReads,
      // Check if any `id` was not found (404) or was unauthorized (403)
      requestResponse.validateMissingIds,
      // Check if any model already exists, for create actions
      requestResponse.validateCreateIds,
      // Paginate output
      requestResponse.handlePaginationOutput,
      // Apply attribute aliases, in output
      requestResponse.renameAliasesOutput,
    ],
  },
];

module.exports = {
  middlewareLayers,
};
/* eslint-enable max-lines */
