'use strict'

const { monitoredReduce } = require('../perf/helpers.js')
const { createInlineFuncs } = require('../functions/inline.js')
const { applyPlugins } = require('../plugins/main.js')

const { loadFile } = require('./reducers/load/main.js')
const { applyCollsDefault } = require('./reducers/colls_default.js')
const { validateCircularRefs } = require('./reducers/circular_refs.js')
const { validateJsonSchemaData } = require('./reducers/json_schema_data.js')
const { validateConfigSyntax } = require('./reducers/syntax/main.js')
const { addDefaults } = require('./reducers/defaults.js')
const { normalizeClientCollname } = require('./reducers/collname.js')
const { addRequiredId } = require('./reducers/required_id.js')
const { normalizeType } = require('./reducers/type.js')
const { mergeNestedColl } = require('./reducers/nested_coll.js')
const { addTypeValidation } = require('./reducers/type_validation.js')
const { normalizeAliases } = require('./reducers/alias.js')
const { addDescriptions } = require('./reducers/description.js')
const { normalizeAuthorize } = require('./reducers/authorize.js')
const { normalizePatchOperators } = require('./reducers/patch_operators.js')
const { normalizeLog } = require('./reducers/log.js')
const { normalizeShortcuts } = require('./reducers/shortcuts/main.js')
const { validateClientCollnames } = require('./reducers/validate_collname.js')
const { validateProtocols } = require('./reducers/protocols.js')
const { validateDatabases } = require('./reducers/databases.js')
const { validateLogs } = require('./reducers/log_validation.js')
const { validateLimits } = require('./reducers/limits.js')
const { compileJsonSchema } = require('./reducers/json_schema.js')
// eslint-disable-next-line import/max-dependencies
const { loadRpc } = require('./reducers/rpc.js')

// Loads config
const loadConfig = function({ measures, configPath, config }) {
  return monitoredReduce({
    funcs: reducers,
    initialInput: { measures, configPath, config },
    mapResponse: ({ config: configA, ...rest }, newConfig) => ({
      config: { ...configA, ...newConfig },
      ...rest,
    }),
    category: 'config',
  })
}

const reducers = [
  // Load config file
  loadFile,
  // Create all config inline functions, i.e. apply `new Function()`
  createInlineFuncs,

  // Apply config.plugins
  applyPlugins,
  // Apply config.collections.default
  applyCollsDefault,

  // Validates that there are no circular references
  validateCircularRefs,
  // Validates JSON schema $data
  validateJsonSchemaData,
  // General config syntax validation
  validateConfigSyntax,

  // Add default attributes
  addDefaults,

  // Normalize `coll.name`
  normalizeClientCollname,
  // Make sure `id` attributes are required
  addRequiredId,
  // Transform `attr.type` to internal format
  normalizeType,
  // Copy `attr.type|description` to nested collections from their target
  mergeNestedColl,
  // Add `attr.validate.type`, using `attr.type`
  addTypeValidation,
  // Set all `attr.alias` and `attr.aliasOf`
  normalizeAliases,
  // Add `attr.description` from `attr.readonly|value|examples|alias`
  addDescriptions,
  // Parse `config.authorize` and `coll.authorize` into AST
  normalizeAuthorize,
  // Parse `operators.attribute|argument` `any`
  normalizePatchOperators,
  // Normalize `log`
  normalizeLog,

  // Startup transformations meant for runtime performance optimization
  normalizeShortcuts,

  // Validate collections are properly named
  validateClientCollnames,
  // Validates `coll.protocols`
  validateProtocols,
  // Validates `coll.databases`
  validateDatabases,
  // Validates `coll.log`
  validateLogs,
  // Validates `limits`
  validateLimits,

  // Compile JSON schema defined in the config
  compileJsonSchema,
  // Fire each `rpcAdapter.load({ config })` function
  loadRpc,
]

module.exports = {
  loadConfig,
}
