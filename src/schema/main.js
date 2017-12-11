'use strict';

const { reduceAsync } = require('../utilities');
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
const loadSchema = async function ({ runOpts: { schema } }) {
  const schemaB = await reduceAsync(
    reducers,
    (schemaA, func) => func({ schema: schemaA }),
    schema,
  );
  return { schema: schemaB };
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
