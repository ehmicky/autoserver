'use strict';

const { addModelName } = require('./model_name');
const { normalizeCommands } = require('./commands');
const { addDefaultId } = require('./default_id');
const { addAttrDefaultValidate } = require('./default_validate');
const { addAttrRequiredId } = require('./required_id');
const { addAttrDefaultType } = require('./default_type');
const { normalizeType } = require('./attr_type');
const { normalizeTransform, normalizeCompute } = require('./transform_attr');
const { setTransformOrder, setComputeOrder } = require('./transform_order');
const { normalizeAliases } = require('./alias');
const { mergeNestedModel } = require('./nested_model');
// eslint-disable-next-line import/max-dependencies
const { addTypeValidation } = require('./type_validation');

// All models|attributes normalizers, in order
const normalizers = [
  { type: 'model', func: addModelName },
  { type: 'model', func: normalizeCommands },
  { type: 'model', func: addDefaultId },
  { type: 'attr', func: addAttrDefaultValidate },
  { type: 'attr', func: addAttrRequiredId },
  { type: 'attr', func: addAttrDefaultType },
  { type: 'attr', func: normalizeType },
  { type: 'attr', func: normalizeTransform },
  { type: 'attr', func: normalizeCompute },
  { type: 'model', func: setTransformOrder },
  { type: 'model', func: setComputeOrder },
  { type: 'model', func: normalizeAliases },
  { type: 'attr', func: mergeNestedModel },
  { type: 'attr', func: addTypeValidation },
];

module.exports = {
  normalizers,
};
