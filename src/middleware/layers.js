/* eslint-disable max-lines */
const { getStatus } = require('./final/status.js')
const { setDuration } = require('./final/duration.js')
const { sendResponse } = require('./final/send_response/main.js')
const { callEvent } = require('./final/call_event.js')
const { perfEvent } = require('./final/perf_event.js')
const { addTimestamp } = require('./time/timestamp.js')
const { setRequestTimeout } = require('./time/timeout.js')
const { setRequestid } = require('./protocol/requestid.js')
const { parseProtocol } = require('./protocol/parse.js')
const { fireRpc } = require('./protocol/rpc.js')
const { router } = require('./rpc/router.js')
const { methodCheck } = require('./rpc/method_check.js')
const { parseRpc } = require('./rpc/parse.js')
const { fireActions } = require('./rpc/actions.js')
const { parseTopAction } = require('./action/top.js')
const { validateArgs } = require('./action/validate_args/main.js')
const { renameArgs } = require('./action/rename_args.js')
const { bindServerParams } = require('./action/server_params.js')
const { parseFilter } = require('./action/filter.js')
const { parseDataArg } = require('./action/data_arg/main.js')
const { parsePopulateCascade } = require('./action/populate_cascade.js')
const { parseOrder } = require('./action/order.js')
const { parseSelect } = require('./action/select/parse.js')
const { parseRename } = require('./action/rename/parse.js')
const { validateRequestLimits } = require('./action/limits.js')
const { validateUnknownAttrs } = require('./action/unknown_attrs/main.js')
const { validateStableIds } = require('./action/stable_ids.js')
const { getSummary } = require('./action/summary.js')
const { setClientNames } = require('./action/client_names.js')
const { sortActions, sortResults } = require('./action/sort.js')
const { addCurrentData } = require('./action/current_data/main.js')
const { patchData } = require('./action/patch_data.js')
const { resolveActions } = require('./action/resolve.js')
const { rollback } = require('./action/rollback/main.js')
const { getModelscount } = require('./action/modelscount.js')
const { applySelect } = require('./action/select/apply.js')
const { assembleResults } = require('./action/assemble.js')
const { applyRename } = require('./action/rename/apply.js')
const { parseResponse } = require('./action/parse_response.js')
const { actionValidationOut } = require('./action/validation_out.js')
const { sequenceRead } = require('./sequencer/read/main.js')
const { sequenceWrite } = require('./sequencer/write/main.js')
const { mergeMetadata } = require('./sequencer/metadata.js')
const { normalizeEmpty } = require('./request_response/normalize_empty.js')
const {
  renameAliasesInput,
  renameAliasesOutput,
} = require('./request_response/aliases/main.js')
const {
  handleValue,
  handleReadonly,
  handleUserDefault,
} = require('./request_response/transform/main.js')
const {
  handlePaginationInput,
} = require('./request_response/pagination/input/main.js')
const {
  validateAuthorization,
} = require('./request_response/authorize/main.js')
const { validateRuntimeFeatures } = require('./request_response/features.js')
const { dataValidation } = require('./request_response/data_validation.js')
const { pickDatabaseAdapter } = require('./database/pick_adapter.js')
const {
  renameIdsInput,
  renameIdsOutput,
} = require('./database/rename_ids/main.js')
const { databaseExecute } = require('./database/execute.js')
const { getDbResponse } = require('./database/response.js')
const {
  responseValidation,
} = require('./request_response/response_validation.js')
const { removeEmptyModels } = require('./request_response/empty_models.js')
const { duplicateReads } = require('./request_response/duplicate_read.js')
const { validateMissingIds } = require('./request_response/missing_ids.js')
const { validateCreateIds } = require('./request_response/create_ids.js')
const {
  handlePaginationOutput,
  // eslint-disable-next-line import/max-dependencies
} = require('./request_response/pagination/output/main.js')

const middlewareLayers = [
  // Final layer, always fired, whether the request fails or not
  {
    name: 'final',
    layers: [
      // Sets response status
      getStatus,
      // Sets how long processing the request took
      setDuration,
      // Sends final response, if success
      sendResponse,
      // Emit "call" events
      callEvent,
      // Emit event about how long the request handling takes
      perfEvent,
    ],
  },

  {
    name: 'time',
    layers: [
      // Add request timestamp
      addTimestamp,
      // Abort request after a certain delay
      setRequestTimeout,
    ],
  },

  {
    name: 'protocol',
    layers: [
      // Sets requestid
      setRequestid,
      // Retrieves protocol request's input
      parseProtocol,

      // Fires rpc layer
      fireRpc,
    ],
  },

  {
    name: 'rpc',
    layers: [
      // Retrieves mInput.rpc, using mInput.path
      router,
      // Check if protocol method is allowed for current rpc
      methodCheck,
      // Use rpc-specific logic to parse the request into an
      // rpc-agnostic `rpcDef`
      parseRpc,

      // Fire action layer
      fireActions,
    ],
  },

  {
    name: 'action',
    layers: [
      // Parse a `rpcDef` into a top-level action
      parseTopAction,
      // Validate client-supplied args
      validateArgs,
      // Change arguments cases to camelCase
      renameArgs,
      // Bind server-specific parameters with their parameters
      bindServerParams,
      // Parse `args.filter` and `args.id` into AST
      parseFilter,
      // Parse `args.data` into write `actions`
      parseDataArg,
      // Parse `args.populate|cascade` into a set of nested `actions`
      parsePopulateCascade,
      // Parse `args.order` from a string to an array of objects
      parseOrder,
      // Parse `args.select` into a set of `actions`
      parseSelect,
      // Parse `args.rename`
      parseRename,
      // Validate request limits
      validateRequestLimits,
      // Validate that attributes in `args.select|data|filter|order`
      // are in the config
      validateUnknownAttrs,
      // Validate that attributes used in nested actions will not change
      validateStableIds,
      // Retrieves `summary`, `commandpaths` and `collections`
      getSummary,
      // Sets `clientCollname` and `clientCollnames`
      setClientNames,
      // Sort `actions` so that top-level ones are fired first
      sortActions,

      // Add `action.currentData`
      // and (for `patch|delete`) fix `action.dataPaths`
      addCurrentData,
      // Merge `currentData` with the `args.data` in `patch` commands
      patchData,
      // Fire all read or write actions, retrieving some `results`
      resolveActions,
      // Rollback write actions if any of them failed
      rollback,

      // Sort `results` so that top-level ones are processed first
      sortResults,
      // Add `modelscount` and `uniquecount`
      getModelscount,
      // Merge all `results` into a single nested response, using `result.path`
      assembleResults,
      // Applies `args.select`
      applySelect,
      // Applies `args.rename`
      applyRename,
      // Add content type, and remove top-level key
      parseResponse,
      // Middleware for rpc-related output validation
      actionValidationOut,
    ],
  },

  {
    name: 'read',
    layers: [
      // Fire one or several read commands for a set of actions
      sequenceRead,
      // Deep merge all results' metadata
      mergeMetadata,
    ],
  },

  {
    name: 'write',
    layers: [
      // Fire one or several write commands for a set of actions
      sequenceWrite,
      // Deep merge all results' metadata
      mergeMetadata,
    ],
  },

  {
    name: 'request',
    layers: [
      // Normalize empty values (undefined, null) by removing their key
      normalizeEmpty,
      // Apply attribute aliases, in mInput
      renameAliasesInput,
      // Process `attr.value`
      handleValue,
      // Apply user-defined default values
      handleUserDefault,
      // Resets readonly attributes in `args.newData`
      handleReadonly,
      // Paginate mInput
      handlePaginationInput,
      // Authorization middleware
      validateAuthorization,
      // Validate database supports command features
      validateRuntimeFeatures,
      // Custom data validation middleware
      dataValidation,
    ],
  },

  {
    name: 'database',
    layers: [
      // Pick database adapter
      pickDatabaseAdapter,
      // Add database-specific id names
      renameIdsInput,

      // Do the database action, protocol and rpc-agnostic
      databaseExecute,

      // Remove database-specific id names
      renameIdsOutput,
      // Retrieves database return value
      getDbResponse,
    ],
  },

  {
    name: 'response',
    layers: [
      // Validate database response
      responseValidation,
      // Remove models that are null|undefined
      removeEmptyModels,
      // Remove duplicate read models
      duplicateReads,
      // Check if any `id` was not found (404) or was unauthorized (403)
      validateMissingIds,
      // Check if any model already exists, for create actions
      validateCreateIds,
      // Paginate output
      handlePaginationOutput,
      // Apply attribute aliases, in output
      renameAliasesOutput,
    ],
  },
]

module.exports = {
  middlewareLayers,
}
/* eslint-enable max-lines */
