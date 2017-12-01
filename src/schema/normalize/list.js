'use strict';

const { rpcSchema } = require('../rpc');

const { applyPlugins } = require('./plugins');
const { applyCollsDefault } = require('./colls_default');
const {
  validateDatabases,
  validateCircularRefs,
  validateJsonSchemaData,
  validateClientCollnames,
  validateSchemaSyntax,
  validateInlineFuncs,
  validateJsonSchema,
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
  normalizeSchemaAuthorize,
  normalizeAuthorize,
  normalizePatchOperators,
} = require('./mappers');
const { normalizeShortcuts } = require('./shortcuts');
const { addInlineFuncPaths } = require('./inline_func');

const normalizers = [
  // Apply schema.plugins
  { type: 'schema', func: applyPlugins },
  // Apply schema.collections.default
  { type: 'schema', func: applyCollsDefault },

  // Validates that there are no circular references
  { type: 'schema', func: validateCircularRefs },
  // Validates JSON schema $data
  { type: 'schema', func: validateJsonSchemaData },
  // General schema syntax validation
  { type: 'schema', func: validateSchemaSyntax },

  // Add default attributes
  { type: 'schema', func: addDefaults },

  // Normalize `coll.name`
  { type: 'coll', func: normalizeClientCollname },
  // Make sure `id` attributes are required
  { type: 'attr', func: addRequiredId },
  // Transform `attr.type` to internal format
  { type: 'attr', func: normalizeType },
  // Copy `attr.type|description` to nested collections from their target
  { type: 'attr', func: mergeNestedColl },
  // Add `attr.validate.type`, using `attr.type`
  { type: 'attr', func: addTypeValidation },
  // Set all `attr.alias` and `attr.aliasOf`
  { type: 'coll', func: normalizeAliases },
  // Add `attr.description` from `attr.readonly|value|examples|alias`
  { type: 'attr', func: addDescriptions },
  // Parse `schema.authorize` into AST
  { type: 'schema', func: normalizeSchemaAuthorize },
  // Parse `coll.authorize` into AST
  { type: 'coll', func: normalizeAuthorize },
  // Parse `operators.attribute|argument` `any`
  { type: 'schema', func: normalizePatchOperators },

  // Compile-time transformations meant for runtime performance optimization
  { type: 'schema', func: normalizeShortcuts },
  // Add `schema.inlineFuncPaths`
  { type: 'schema', func: addInlineFuncPaths },

  // Validate collections are properly named
  { type: 'schema', func: validateClientCollnames },
  // Validates `coll.database`
  { type: 'coll', func: validateDatabases },
  // Validates that there are no circular references
  { type: 'schema', func: validateCircularRefs },
  // Check inline functions are valid by compiling then
  { type: 'schema', func: validateInlineFuncs },
  // Validates that `attr.validate` are valid JSON schema
  { type: 'schema', func: validateJsonSchema },

  // Apply rpc-specific compile-time logic
  { type: 'schema', func: rpcSchema },
];

module.exports = {
  normalizers,
};
