'use strict';

const { mapValues, omit } = require('../../../../utilities');

const transformAttributes = function ({ idl, idl: { models } }) {
  return mapValues(models, model => {
    if (!model.properties) { return model; }

    const properties = mapValues(model.properties, (attr, attrName) => {
      const newAttr = mapper({ attr, attrName, idl });
      const newItems = attr.items
        ? { items: mapper({ attr: attr.items, attrName: 'items', idl }) }
        : {};
      return Object.assign({}, newAttr, newItems);
    });
    return Object.assign({}, model, { properties });
  });
};

const mapper = function ({ attr: oAttr, attrName, idl }) {
  return transformers.reduce(
    (attr, transformer) => reduceModels({ transformer, attr, attrName, idl }),
    oAttr,
  );
};

const reduceModels = function ({ transformer, attr, attrName, idl }) {
  if (!attr || attr.constructor !== Object) { return attr; }

  const newAttr = transformer(attr, { attrName, idl });
  return Object.assign({}, attr, newAttr);
};

// Shallow copy nested models from the `model.id` they refer to
const mergeNestedModel = function (attr, { idl: { models } }) {
  if (!attr.model) { return; }

  const model = Object.values(models).find(mod => mod.model === attr.model);
  const modelId = model.properties.id;
  // Any specified property has higher priority
  const referedModelId = omit(modelId, Object.keys(attr));
  return referedModelId;
};

// Defaults `type` for nested attributes, or normal attributes
const addAttrDefaultType = function (attr) {
  if (attr.type) { return; }

  const type = getDefaultType(attr);
  return { type };
};

const getDefaultType = function ({ items }) {
  if (items) { return 'array'; }
  return 'string';
};

const transformers = [
  mergeNestedModel,
  addAttrDefaultType,
];

module.exports = {
  transformAttributes,
};
