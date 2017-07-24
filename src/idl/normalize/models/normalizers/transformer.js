'use strict';

const { mapValues } = require('../../../../utilities');
const { normalizeCommandNames } = require('../../commands');

const transformModels = function ({ idl, models }) {
  return mapValues(models, (model, name) => {
    const newModel = mapper({ value: model, type: 'model', key: name, idl });

    // TODO: model.properties might not exist
    // TODO: merge with other sigling files

    const properties = mapValues(newModel.properties, (attr, attrName) => {
      const newAttr = mapper({ value: attr, type: 'attr', key: attrName, idl });
      const items = newAttr.items
        ? mapper({ value: attr.items, type: 'attr', key: 'items', idl })
        : undefined;
      return Object.assign({}, newAttr, { items });
    });
    return Object.assign({}, newModel, { properties });
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
const addModelDefaultType = function (model) {
  if (model.type) { return; }

  return { type: 'object' };
};

// Default `model.model` to parent key
const addModelName = function (model, { key }) {
  if (model.model) { return; }

  return { model: key };
};

// Normalize `commands`, and adds defaults
const normalizeCommands = function (model, { idl }) {
  const commandNames = model.commands || idl.commands;
  const commands = normalizeCommandNames(commandNames);
  return { commands };
};

// Defaults `type` for nested attributes, or normal attributes
const addAttrDefaultType = function (attr) {
  if (attr.type) { return; }

  const type = getDefaultType(attr);
  return { type };
};

const getDefaultType = function (attr) {
  if (attr.items) { return 'array'; }
  if (attr.model) { return 'object'; }
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
    addAttrDefaultType,
  ],
};

module.exports = {
  transformModels,
};
