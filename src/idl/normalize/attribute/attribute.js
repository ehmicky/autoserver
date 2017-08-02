'use strict';

const { mapValues } = require('../../../utilities');

const { addAttrDefaultValidate } = require('./validate');
const { addAttrRequiredId } = require('./required_id');
const { addAttrDefaultType } = require('./default_type');
const { normalizeType } = require('./type');
const { normalizeTransform, normalizeCompute } = require('./transform');
const { mergeNestedModel } = require('./nested_model');
const { addTypeValidation } = require('./type_validation');

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

const mapperFunc = function ({ transformers, idl }, { attr, attrName }) {
  return transformers.reduce(
    (attrA, transformer) => transformer(attrA, { attrName, idl }),
    attr,
  );
};

// Do not use .bind() because we want a clean function name,
// because the performance monitoring uses it
const normalizeAttrsBefore = (...args) => normalizeAttrs('before', ...args);
const normalizeAttrsAfter = (...args) => normalizeAttrs('after', ...args);

const allTransformers = {
  before: [
    addAttrDefaultValidate,
    addAttrRequiredId,
    addAttrDefaultType,
    normalizeType,
    normalizeTransform,
    normalizeCompute,
  ],
  after: [
    mergeNestedModel,
    addTypeValidation,
  ],
};

module.exports = {
  normalizeAttrsBefore,
  normalizeAttrsAfter,
};
