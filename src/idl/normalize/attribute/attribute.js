'use strict';

const { mapValues } = require('../../../utilities');

const { mergeNestedModel } = require('./nested_model');
const { addAttrDefaultType } = require('./type');
const { normalizeTransform, normalizeCompute } = require('./transform');

const normalizeAttrs = function (type, { idl, idl: { models: oModels } }) {
  const transformers = allTransformers[type];
  const mapper = mapperFunc.bind(null, { transformers, idl });

  const models = mapValues(oModels, model => {
    if (!model.properties) { return model; }

    const properties = mapValues(model.properties, (attr, attrName) => {
      const newAttr = mapper({ attr, attrName });
      const newItems = attr.items
        ? { items: mapper({ attr: attr.items, attrName: 'items' }) }
        : {};
      return Object.assign({}, newAttr, newItems);
    });
    return Object.assign({}, model, { properties });
  });
  return Object.assign({}, idl, { models });
};

// Do not use .bind() because we want a clean function name,
// because the performance monitoring uses it
const normalizeAttrsBefore = (...args) => normalizeAttrs('before', ...args);
const normalizeAttrsAfter = (...args) => normalizeAttrs('after', ...args);

const mapperFunc = function ({ transformers, idl }, { attr: oAttr, attrName }) {
  return transformers.reduce(
    (attr, transformer) => reduceAttrs({ transformer, attr, attrName, idl }),
    oAttr,
  );
};

const reduceAttrs = function ({ transformer, attr, attrName, idl }) {
  if (!attr || attr.constructor !== Object) { return attr; }

  const newAttr = transformer(attr, { attrName, idl });
  return Object.assign({}, attr, newAttr);
};

const allTransformers = {
  before: [
    addAttrDefaultType,
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
