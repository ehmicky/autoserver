'use strict';

const { mapValues } = require('../../../utilities');

const { addModelName } = require('./name');
const { normalizeCommands } = require('./commands');
const { setTransformOrder, setComputeOrder } = require('./transform');
const { normalizeAliases } = require('./alias');

const normalizeModels = function ({ idl, idl: { models } }) {
  const modelsA = mapValues(models, (model, modelName) =>
    normalizeModel({ model, modelName, idl })
  );
  return { ...idl, models: modelsA };
};

const normalizeModel = function ({ model, modelName, idl }) {
  return transformers.reduce(
    (modelA, transformer) => reduceModels({
      transformer,
      model: modelA,
      modelName,
      idl,
    }),
    model,
  );
};

const reduceModels = function ({ transformer, model, modelName, idl }) {
  if (!model || model.constructor !== Object) { return model; }

  const modelA = transformer(model, { modelName, idl }) || {};
  return { ...model, ...modelA };
};

const transformers = [
  addModelName,
  normalizeCommands,
  setTransformOrder,
  setComputeOrder,
  normalizeAliases,
];

module.exports = {
  normalizeModels,
};
