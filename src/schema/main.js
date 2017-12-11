'use strict';

const { monitoredReduce } = require('../perf');
const { createInlineFuncs } = require('../functions');

const {
  loadFile,
  applyPlugins,
  applyCollsDefault,
  validateCircularRefs,
  validateJsonSchemaData,
  validateSchemaSyntax,
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

// Loads schema
const loadSchema = function ({ measures, schemaPath, schema }) {
  return monitoredReduce({
    funcs: reducers,
    initialInput: { measures, schemaPath, schema },
    mapResponse: ({ schema: schemaA, ...rest }, newSchema) =>
      ({ schema: { ...schemaA, ...newSchema }, ...rest }),
    category: 'schema',
  });
};

const reducers = [
  // Load schema file
  loadFile,
  // Create all schema inline functions, i.e. apply `new Function()`
  createInlineFuncs,

  // Apply schema.plugins
  applyPlugins,
  // Apply schema.collections.default
  applyCollsDefault,

  // Validates that there are no circular references
  validateCircularRefs,
  // Validates JSON schema $data
  validateJsonSchemaData,
  // General schema syntax validation
  validateSchemaSyntax,

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
  // Parse `schema.authorize` and `coll.authorize` into AST
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

  // Compile JSON schema defined in the schema
  compileJsonSchema,
  // Fire each `rpcAdapter.load({ schema })` function
  loadRpc,
];

module.exports = {
  loadSchema,
};
