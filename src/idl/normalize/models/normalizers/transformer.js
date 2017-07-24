'use strict';

const { transform, omit, fullRecurseMap } = require('../../../../utilities');
const { normalizeCommandNames } = require('../../commands');

// TODO: remove `modelType`

const transformModels = function ({ idl, models }) {
  const newModels = fullRecurseMap(
    models,
    (value, key) => transformers.reduce(
      (obj, transformer) => reduceModels({ obj, transformer, key, idl }),
      value,
    )
  );
  transform({ transforms, input: newModels });

  return newModels;
};

const reduceModels = function ({ obj, transformer, key, idl }) {
  if (!obj || obj.constructor !== Object) { return obj; }

  const newValues = transformer(obj, { key, idl });
  return Object.assign({}, obj, newValues);
};

// Default `model.type` to `object`
const addModelDefaultType = function (model) {
  if (model.modelType !== 'model' || model.type) { return; }

  return { type: 'object' };
};

// Default `model.model` to parent key
const addModelName = function (model, { key }) {
  if (model.modelType !== 'model' || model.model) { return; }

  return { model: key };
};

// Normalize `commands`, and adds defaults
const normalizeCommands = function (model, { idl }) {
  if (model.modelType !== 'model') { return; }

  const commandNames = model.commands || idl.commands;
  const commands = normalizeCommandNames(commandNames);
  return { commands };
};

// Defaults `type` for nested attributes, or normal attributes
const addAttrDefaultType = function (attr) {
  if (attr.modelType !== 'attribute' || attr.type) { return; }

  const type = getDefaultType(attr);
  return { type };
};

const getDefaultType = function (attr) {
  if (attr.items) { return 'array'; }
  if (attr.model) { return 'object'; }
  return 'string';
};

// List of transformations to apply to normalize IDL models
const transformers = [
  addModelDefaultType,
  addModelName,
  normalizeCommands,
  addAttrDefaultType,
];

const transforms = [

  {
    model ({ value, parent, parents: [rootParent] }) {
      if (!parent.model || parent.modelType !== 'attribute') { return; }

      // Dereference `model` pointers, using a shallow copy,
      // while avoiding overriding any property already defined
      return omit(rootParent[value], Object.keys(parent));
    },
  },

];

module.exports = {
  transformModels,
};
