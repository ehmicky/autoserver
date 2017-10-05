'use strict';

const { operationsIdl } = require('../operations');

const { applyPlugins } = require('./plugins');
const { applyModelDefault } = require('./model_default');
const { validateIdlCircularRefs } = require('./circular_refs');
const { validateData } = require('./data');
const { validateModelNames } = require('./model_names');
const { validateIdlSyntax } = require('./syntax');
const { addModelName } = require('./model_name');
const { normalizeCommands } = require('./commands');
const { addDefaultId } = require('./default_id');
const { addAttrDefaultValidate } = require('./default_validate');
const { addAttrRequiredId } = require('./required_id');
const { addAttrDefaultType } = require('./default_type');
const { normalizeType } = require('./attr_type');
const { normalizeAliases } = require('./alias');
const { mergeNestedModel } = require('./nested_model');
const { addDescriptions } = require('./description');
const { addTypeValidation } = require('./type_validation');
const { normalizeShortcuts } = require('./shortcuts');
const { addInlineFuncPaths } = require('./inline_func_paths');
const { validateJsonSchema } = require('./json_schema');
// eslint-disable-next-line import/max-dependencies
const { validateInlineFuncs } = require('./inline_func');

const normalizers = [
  // Apply idl.plugins
  { type: 'idl', func: applyPlugins },
  // Apply idl.default
  { type: 'idl', func: applyModelDefault },

  { type: 'idl', func: validateIdlCircularRefs },
  { type: 'idl', func: validateData },
  { type: 'idl', func: validateModelNames },
  { type: 'idl', func: validateIdlSyntax },

  { type: 'model', func: addModelName },
  { type: 'model', func: normalizeCommands },
  { type: 'model', func: addDefaultId },
  { type: 'attr', func: addAttrDefaultValidate },
  { type: 'attr', func: addAttrRequiredId },
  { type: 'attr', func: addAttrDefaultType },
  { type: 'attr', func: normalizeType },
  { type: 'model', func: normalizeAliases },
  { type: 'attr', func: mergeNestedModel },
  { type: 'attr', func: addDescriptions },
  { type: 'attr', func: addTypeValidation },

  { type: 'idl', func: normalizeShortcuts },
  { type: 'idl', func: addInlineFuncPaths },

  { type: 'idl', func: validateIdlCircularRefs },
  { type: 'idl', func: validateInlineFuncs },
  { type: 'idl', func: validateJsonSchema },

  // Apply operation-specific compile-time logic
  { type: 'idl', func: operationsIdl },
];

module.exports = {
  normalizers,
};
