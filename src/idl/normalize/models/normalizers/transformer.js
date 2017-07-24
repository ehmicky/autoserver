'use strict';

const { difference } = require('lodash');

const { ACTIONS } = require('../../../../constants');
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

// Default `prop.type` to `array` if `prop.items` exist
const addArrayDefaultType = function (prop) {
  if (prop.type || !prop.items) { return; }

  return { type: 'array' };
};

// Default `model.type` to `object`
const addModelDefaultType = function (model) {
  if (model.modelType !== 'model') { return; }

  return { type: 'object' };
};

// Default `model.model` to parent key
const addModelName = function (model, { key }) {
  if (model.modelType !== 'model') { return; }

  return { model: key };
};

// Defaults `type` for nested attributes, or normal attributes
const addAttributeDefaultType = function (attr) {
  if (attr.modelType !== 'attribute' || attr.type) { return; }

  const type = attr.model ? 'object' : 'string';
  return { type };
};

// Do not allow custom properties
const noCustomProps = function (obj) {
  if (!['model', 'attribute'].includes(obj.modelType)) { return; }

  return { additionalProperties: false };
};

// Normalize `commands`, and adds defaults
const normalizeCommands = function (model, { idl }) {
  if (model.modelType !== 'model') { return; }

  const commandNames = model.commands || idl.commands;
  const commands = normalizeCommandNames(commandNames);
  return { commands };
};

// Add allowed `actions` to each model
const addActions = function (model) {
  if (model.modelType !== 'model') { return; }

  const { commands } = model;
  const actions = ACTIONS
    .filter(({ commandNames }) =>
      difference(commandNames, commands).length === 0
    )
    .map(({ name }) => name);
  return { actions };
};

// List of transformations to apply to normalize IDL models
const transformers = [
  addArrayDefaultType,
  addModelDefaultType,
  addModelName,
  addAttributeDefaultType,
  noCustomProps,
  normalizeCommands,
  addActions,
];

const transforms = [

  {
    model ({ value, parent, parents: [rootParent] }) {
      const [, instance] = Object.entries(rootParent)
        .find(([modelName]) => modelName === value);
      if (instance === parent) { return; }

      // Dereference `model` pointers, using a shallow copy,
      // while avoiding overriding any property already defined
      return omit(instance, Object.keys(parent));
    },
  },

];

module.exports = {
  transformModels,
};
