'use strict';

const { mapValues, omit } = require('../../../../utilities');
const { normalizeCommandNames } = require('../../commands');

// TODO: merge with other sibling files
const transformModels = function ({ idl, idl: { models } }) {
  return mapValues(models, (model, name) =>
    mapper({ value: model, type: 'model', key: name, idl })
  );
};

const transformAttributes = function ({ idl, idl: { models } }) {
  return mapValues(models, model => {
    if (!model.properties) { return model; }

    const properties = mapValues(model.properties, (attr, attrName) => {
      const newAttr = mapper({ value: attr, type: 'attr', key: attrName, idl });
      const items = newAttr.items
        ? mapper({ value: attr.items, type: 'attr', key: 'items', idl })
        : undefined;
      return Object.assign({}, newAttr, { items });
    });
    return Object.assign({}, model, { properties });
  });
};

const mapper = function ({ value, type, key, idl }) {
  const trans = transformers[type];
  return trans.reduce(
    (obj, transformer) => reduceModels({ obj, transformer, key, idl }),
    value,
  );
};

const reduceModels = function ({ obj, transformer, key, idl }) {
  if (!obj || obj.constructor !== Object) { return obj; }

  const newValues = transformer(obj, { key, idl });
  return Object.assign({}, obj, newValues);
};

// Default `model.type` to `object`
const addModelDefaultType = function ({ type }) {
  if (type) { return; }

  return { type: 'object' };
};

// Default `model.model` to parent key
const addModelName = function ({ model }, { key }) {
  if (model) { return; }

  return { model: key };
};

// Normalize `commands`, and adds defaults
const normalizeCommands = function (model, { idl }) {
  const commandNames = model.commands || idl.commands;
  const commands = normalizeCommandNames(commandNames);
  return { commands };
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

// List of transformations to apply to normalize IDL models and attributes
const transformers = {
  model: [
    addModelDefaultType,
    addModelName,
    normalizeCommands,
  ],
  attr: [
    mergeNestedModel,
    addAttrDefaultType,
  ],
};

module.exports = {
  transformModels,
  transformAttributes,
};
