'use strict';

const { mapValues } = require('../../../utilities');

const { mergeNestedModel } = require('./nested_model');
const { addAttrDefaultType } = require('./type');
const { addAttrDefaultValidate } = require('./validate');
const { addAttrDefaultMultiple } = require('./multiple');
const { normalizeTransform, normalizeCompute } = require('./transform');

const normalizeAttrs = function (type, { idl, idl: { models } }) {
  const transformers = allTransformers[type];
  const mapper = mapperFunc.bind(null, { transformers, idl });

  const modelsA = mapValues(models, model => normalizeModel({ model, mapper }));
  return { ...idl, models: modelsA };
};

const normalizeModel = function ({ model, model: { properties }, mapper }) {
  if (!properties) { return model; }

  const propertiesA = mapValues(
    properties,
    (attr, attrName) => mapper({ attr, attrName }),
  );
  return { ...model, properties: propertiesA };
};

// Do not use .bind() because we want a clean function name,
// because the performance monitoring uses it
const normalizeAttrsBefore = (...args) => normalizeAttrs('before', ...args);
const normalizeAttrsAfter = (...args) => normalizeAttrs('after', ...args);

const mapperFunc = function ({ transformers, idl }, { attr, attrName }) {
  return transformers.reduce(
    (attrA, transformer) => reduceAttrs({
      transformer,
      attr: attrA,
      attrName,
      idl,
    }),
    attr,
  );
};

const reduceAttrs = function ({ transformer, attr, attrName, idl }) {
  if (!attr || attr.constructor !== Object) { return attr; }

  const attrA = transformer(attr, { attrName, idl });
  return { ...attr, ...attrA };
};

const allTransformers = {
  before: [
    addAttrDefaultValidate,
    addAttrDefaultType,
    addAttrDefaultMultiple,
    normalizeTransform,
    normalizeCompute,
  ],
  after: [
    mergeNestedModel,
  ],
};

module.exports = {
  normalizeAttrsBefore,
  normalizeAttrsAfter,
};
