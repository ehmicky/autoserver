'use strict';

const {
  addModelName,
  normalizeCommands,
  addDefaultId,
  normalizeAliases,
} = require('./model');
const {
  addAttrDefaultValidate,
  addAttrRequiredId,
  addAttrDefaultType,
  normalizeType,
  mergeNestedModel,
  addDescriptions,
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
  { type: 'model', func: normalizeAliases },
  { type: 'attr', func: mergeNestedModel },
  { type: 'attr', func: addDescriptions },
  { type: 'attr', func: addTypeValidation },
];

module.exports = {
  normalizers,
};
