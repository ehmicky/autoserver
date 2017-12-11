'use strict';

const { dereferenceRefs } = require('../json_refs');
const { createInlineFuncs } = require('../functions');

const { applyPlugins } = require('./plugins');
const { applyCollsDefault } = require('./colls_default');
const {
  validateDatabases,
  validateCircularRefs,
  validateJsonSchemaData,
  validateClientCollnames,
  validateSchemaSyntax,
  validateLimits,
} = require('./validate');
const { addDefaults } = require('./defaults');
const {
  normalizeClientCollname,
  addRequiredId,
  normalizeType,
  addTypeValidation,
  mergeNestedColl,
  normalizeAliases,
  addDescriptions,
  normalizeAuthorize,
  normalizePatchOperators,
  normalizeLog,
} = require('./mappers');
const { normalizeShortcuts } = require('./shortcuts');
const { compileJsonSchema } = require('./json_schema');
const { loadRpc } = require('./rpc');

const reducers = [
  // Load file
  dereferenceRefs,
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
  reducers,
};
