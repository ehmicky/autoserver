'use strict';

const { mapValues } = require('../../../../utilities');
const { normalizeCommandNames } = require('../../commands');

const transformModels = function ({ idl, idl: { models } }) {
  return mapValues(models, (oModel, modelName) =>
    transformers.reduce(
      (model, transformer) => reduceModels({
        transformer,
        model,
        modelName,
        idl,
      }),
      oModel,
    )
  );
};

const reduceModels = function ({ transformer, model, modelName, idl }) {
  if (!model || model.constructor !== Object) { return model; }

  const newModel = transformer(model, { modelName, idl });
  return Object.assign({}, model, newModel);
};

// Default `model.type` to `object`
const addModelDefaultType = function ({ type }) {
  if (type) { return; }

  return { type: 'object' };
};

// Default `model.model` to parent key
const addModelName = function ({ model }, { modelName }) {
  if (model) { return; }

  return { model: modelName };
};

// Normalize `commands`, and adds defaults
const normalizeCommands = function (model, { idl }) {
  const commandNames = model.commands || idl.commands;
  const commands = normalizeCommandNames(commandNames);
  return { commands };
};

const transformers = [
  addModelDefaultType,
  addModelName,
  normalizeCommands,
];

module.exports = {
  transformModels,
};
