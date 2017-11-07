'use strict';

const { rpcSchema } = require('../rpc');

const { applyPlugins } = require('./plugins');
const { applyModelsDefault } = require('./model_default');
const {
  validateDatabases,
  validateCircularRefs,
  validateJsonSchemaData,
  validateModelNaming,
  validateSchemaSyntax,
  validateInlineFuncs,
  validateJsonSchema,
} = require('./validate');
const {
  addDefaultModelname,
  addDefaultId,
  addDefaultDatabase,
  addDefaultValidate,
  addDefaultType,
} = require('./default');
const {
  addRequiredId,
  normalizeType,
  addTypeValidation,
  mergeNestedModel,
  normalizeAliases,
  addDescriptions,
  normalizeSchemaAuthorize,
  normalizeAuthorize,
} = require('./mappers');
const { normalizeShortcuts } = require('./shortcuts');
const { addInlineFuncPaths } = require('./inline_func');

const normalizers = [
  // Apply schema.plugins
  { type: 'schema', func: applyPlugins },
  // Apply schema.model.default
  { type: 'schema', func: applyModelsDefault },

  // Validates that there are no circular references
  { type: 'schema', func: validateCircularRefs },
  // Validates JSON schema $data
  { type: 'schema', func: validateJsonSchemaData },
  // Validate models are properly named
  { type: 'schema', func: validateModelNaming },
  // General schema syntax validation
  { type: 'schema', func: validateSchemaSyntax },

  // Default `model.model`
  { type: 'model', func: addDefaultModelname },
  // Default `model.id` attribute
  { type: 'model', func: addDefaultId },
  // Default `model.database`
  { type: 'model', func: addDefaultDatabase },
  // Default `attr.type`
  { type: 'attr', func: addDefaultType },
  // Default `attr.validate`
  { type: 'attr', func: addDefaultValidate },

  // Make sure `id` attributes are required
  { type: 'attr', func: addRequiredId },
  // Transform `attr.type` to internal format
  { type: 'attr', func: normalizeType },
  // Add `attr.validate.type`, using `attr.type`
  { type: 'attr', func: addTypeValidation },
  // Copy `attr.type|description` to nested models from their target
  { type: 'attr', func: mergeNestedModel },
  // Set all `attr.alias` and `attr.aliasOf`
  { type: 'model', func: normalizeAliases },
  // Add `attr.description` from `attr.readonly|value|examples|alias`
  { type: 'attr', func: addDescriptions },
  // Parse `schema.authorize` into AST
  { type: 'schema', func: normalizeSchemaAuthorize },
  // Parse `model.authorize` into AST
  { type: 'model', func: normalizeAuthorize },

  // Compile-time transformations meant for runtime performance optimization
  { type: 'schema', func: normalizeShortcuts },
  // Add `schema.inlineFuncPaths`
  { type: 'schema', func: addInlineFuncPaths },

  // Validates `model.database`
  { type: 'model', func: validateDatabases },
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
