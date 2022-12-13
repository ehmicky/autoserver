import { createInlineFuncs } from '../functions/inline.js'
import { monitoredReduce } from '../perf/helpers.js'
import { applyPlugins } from '../plugins/main.js'

import { normalizeAliases } from './reducers/alias.js'
import { normalizeAuthorize } from './reducers/authorize.js'
import { validateCircularRefs } from './reducers/circular_refs.js'
import { normalizeClientCollname } from './reducers/collname.js'
import { applyCollsDefault } from './reducers/colls_default.js'
import { validateDatabases } from './reducers/databases.js'
import { addDefaults } from './reducers/defaults.js'
import { addDescriptions } from './reducers/description.js'
import { compileJsonSchema } from './reducers/json_schema.js'
import { validateJsonSchemaData } from './reducers/json_schema_data.js'
import { validateLimits } from './reducers/limits.js'
import { loadFile } from './reducers/load/main.js'
import { normalizeLog } from './reducers/log.js'
import { validateLogs } from './reducers/log_validation.js'
import { mergeNestedColl } from './reducers/nested_coll.js'
import { normalizePatchOperators } from './reducers/patch_operators.js'
import { validateProtocols } from './reducers/protocols.js'
import { addRequiredId } from './reducers/required_id.js'
import { loadRpc } from './reducers/rpc.js'
import { normalizeShortcuts } from './reducers/shortcuts/main.js'
import { validateConfigSyntax } from './reducers/syntax/main.js'
import { normalizeType } from './reducers/type.js'
import { addTypeValidation } from './reducers/type_validation.js'
// eslint-disable-next-line import/max-dependencies
import { validateClientCollnames } from './reducers/validate_collname.js'

// Loads config
export const loadConfig = ({ measures, configPath, config }) =>
  monitoredReduce({
    funcs: reducers,
    initialInput: { measures, configPath, config },
    mapResponse: ({ config: configA, ...rest }, newConfig) => ({
      config: { ...configA, ...newConfig },
      ...rest,
    }),
    category: 'config',
  })

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
