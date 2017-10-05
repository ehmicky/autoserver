'use strict';

const { operationsIdl } = require('../operations');

const { applyPlugins } = require('./plugins');
const { applyModelDefault } = require('./model_default');
const {
  validateIdlCircularRefs,
  validateJsonSchemaData,
  validateModelNaming,
  validateIdlSyntax,
  validateInlineFuncs,
  validateJsonSchema,
} = require('./validate');
const {
  addDefaultModelName,
  addDefaultCommands,
  addDefaultId,
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
} = require('./mappers');
const { normalizeShortcuts } = require('./shortcuts');
const { addInlineFuncPaths } = require('./inline_func');

const normalizers = [
  // Apply idl.plugins
  { type: 'idl', func: applyPlugins },
  // Apply idl.model.default
  { type: 'idl', func: applyModelDefault },

  // Validates that there are no circular references
  { type: 'idl', func: validateIdlCircularRefs },
  // Validates JSON schema $data
  { type: 'idl', func: validateJsonSchemaData },
  // Validate models are properly named
  { type: 'idl', func: validateModelNaming },
  // General IDL syntax validation
  { type: 'idl', func: validateIdlSyntax },

  // Default `model.model`
  { type: 'model', func: addDefaultModelName },
  // Default `model.id` attribute
  { type: 'model', func: addDefaultId },
  // Default `attr.type`
  { type: 'attr', func: addDefaultType },
  // Default `attr.validate`
  { type: 'attr', func: addDefaultValidate },
  // Default `model.commands`
  { type: 'model', func: addDefaultCommands },

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

  // Compile-time transformations meant for runtime performance optimization
  { type: 'idl', func: normalizeShortcuts },
  // Add `idl.inlineFuncPaths`
  { type: 'idl', func: addInlineFuncPaths },

  // Validates that there are no circular references
  { type: 'idl', func: validateIdlCircularRefs },
  // Check inline functions are valid by compiling then
  { type: 'idl', func: validateInlineFuncs },
  // Validates that `attr.validate` are valid JSON schema
  { type: 'idl', func: validateJsonSchema },

  // Apply operation-specific compile-time logic
  { type: 'idl', func: operationsIdl },
];

module.exports = {
  normalizers,
};
