'use strict';

const {
  addModelName,
  normalizeCommands,
  addDefaultId,
  setTransformOrder,
  setComputeOrder,
  normalizeAliases,
} = require('./model');
const {
  addAttrDefaultValidate,
  addAttrRequiredId,
  addAttrDefaultType,
  normalizeType,
  normalizeTransform,
  normalizeCompute,
  addAttrDefaultReadonly,
  mergeNestedModel,
  addTypeValidation,
} = require('./attribute');

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
  { type: 'attr', func: addAttrDefaultReadonly },
  { type: 'model', func: setTransformOrder },
  { type: 'model', func: setComputeOrder },
  { type: 'model', func: normalizeAliases },
  { type: 'attr', func: mergeNestedModel },
  { type: 'attr', func: addTypeValidation },
];

module.exports = {
  normalizers,
};
