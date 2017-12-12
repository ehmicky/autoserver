'use strict';

const { monitoredReduce } = require('../perf');
const { createInlineFuncs } = require('../functions');

const {
  loadFile,
  applyPlugins,
  applyCollsDefault,
  validateCircularRefs,
  validateJsonSchemaData,
  validateConfigSyntax,
  addDefaults,
  normalizeClientCollname,
  addRequiredId,
  normalizeType,
  mergeNestedColl,
  addTypeValidation,
  normalizeAliases,
  addDescriptions,
  normalizeAuthorize,
  normalizePatchOperators,
  normalizeLog,
  normalizeShortcuts,
  validateClientCollnames,
  validateDatabases,
  validateLimits,
  compileJsonSchema,
  loadRpc,
} = require('./reducers');

// Loads config
const loadConfig = function ({ measures, configPath, config }) {
  return monitoredReduce({
    funcs: reducers,
    initialInput: { measures, configPath, config },
    mapResponse: ({ config: configA, ...rest }, newConfig) =>
      ({ config: { ...configA, ...newConfig }, ...rest }),
    category: 'config',
  });
};

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
  // Validates `coll.database`
  validateDatabases,
  // Validates `limits`
  validateLimits,

  // Compile JSON schema defined in the config
  compileJsonSchema,
  // Fire each `rpcAdapter.load({ config })` function
  loadRpc,
];

module.exports = {
  loadConfig,
};
