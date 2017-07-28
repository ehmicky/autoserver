'use strict';

const { mapValues } = require('../../../utilities');

const { mergeNestedModel } = require('./nested_model');
const { addAttrDefaultType } = require('./type');
const { normalizeTransform, normalizeCompute } = require('./transform');

const normalizeAttrs = function (type, { idl, idl: { models } }) {
  const transformers = allTransformers[type];
  const mapper = mapperFunc.bind(null, { transformers, idl });

  const modelsA = mapValues(models, model => {
    if (!model.properties) { return model; }

    const properties = mapValues(model.properties, (attr, attrName) => {
      const attrA = mapper({ attr, attrName });
      const itemsA = attr.items
        ? { items: mapper({ attr: attr.items, attrName: 'items' }) }
        : {};
      return { ...attrA, ...itemsA };
    });
    return { ...model, properties };
  });
  return { ...idl, models: modelsA };
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
