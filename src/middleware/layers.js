/* eslint-disable max-lines */
import { assembleResults } from './action/assemble.js'
import { setClientNames } from './action/client_names.js'
import { addCurrentData } from './action/current_data/main.js'
import { parseDataArg } from './action/data_arg/main.js'
import { parseFilter } from './action/filter.js'
import { validateRequestLimits } from './action/limits.js'
import { getModelscount } from './action/modelscount.js'
import { parseOrder } from './action/order.js'
import { parseResponse } from './action/parse_response.js'
import { patchData } from './action/patch_data.js'
import { parsePopulateCascade } from './action/populate_cascade.js'
import { applyRename } from './action/rename/apply.js'
import { parseRename } from './action/rename/parse.js'
import { renameArgs } from './action/rename_args.js'
import { resolveActions } from './action/resolve.js'
import { rollback } from './action/rollback/main.js'
import { applySelect } from './action/select/apply.js'
import { parseSelect } from './action/select/parse.js'
import { bindServerParams } from './action/server_params.js'
import { sortActions, sortResults } from './action/sort.js'
import { validateStableIds } from './action/stable_ids.js'
import { getSummary } from './action/summary.js'
import { parseTopAction } from './action/top.js'
import { validateUnknownAttrs } from './action/unknown_attrs/main.js'
import { validateArgs } from './action/validate_args/main.js'
import { actionValidationOut } from './action/validation_out.js'
import { databaseExecute } from './database/execute.js'
import { pickDatabaseAdapter } from './database/pick_adapter.js'
import { renameIdsInput, renameIdsOutput } from './database/rename_ids/main.js'
import { getDbResponse } from './database/response.js'
import { callEvent } from './final/call_event.js'
import { setDuration } from './final/duration.js'
import { perfEvent } from './final/perf_event.js'
import { sendResponse } from './final/send_response/main.js'
import { getStatus } from './final/status.js'
import { parseProtocol } from './protocol/parse.js'
import { setRequestid } from './protocol/requestid.js'
import { fireRpc } from './protocol/rpc.js'
import {
  renameAliasesInput,
  renameAliasesOutput,
} from './request_response/aliases/main.js'
import { validateAuthorization } from './request_response/authorize/main.js'
import { validateCreateIds } from './request_response/create_ids.js'
import { dataValidation } from './request_response/data_validation.js'
import { duplicateReads } from './request_response/duplicate_read.js'
import { removeEmptyModels } from './request_response/empty_models.js'
import { validateRuntimeFeatures } from './request_response/features.js'
import { validateMissingIds } from './request_response/missing_ids.js'
import { normalizeEmpty } from './request_response/normalize_empty.js'
import { handlePaginationInput } from './request_response/pagination/input/main.js'
import { handlePaginationOutput } from './request_response/pagination/output/main.js'
import { responseValidation } from './request_response/response_validation.js'
import {
  handleValue,
  handleReadonly,
  handleUserDefault,
} from './request_response/transform/main.js'
import { fireActions } from './rpc/actions.js'
import { methodCheck } from './rpc/method_check.js'
import { parseRpc } from './rpc/parse.js'
import { router } from './rpc/router.js'
import { mergeMetadata } from './sequencer/metadata.js'
import { sequenceRead } from './sequencer/read/main.js'
import { sequenceWrite } from './sequencer/write/main.js'
import { setRequestTimeout } from './time/timeout.js'
// eslint-disable-next-line import/max-dependencies
import { addTimestamp } from './time/timestamp.js'

export const middlewareLayers = [
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
/* eslint-enable max-lines */
