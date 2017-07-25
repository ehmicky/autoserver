'use strict';

const { mapValues } = require('../../../utilities');

const { addModelDefaultType } = require('./type');
const { addModelName } = require('./name');
const { normalizeCommands } = require('./commands');
const { setTransformOrder, setComputeOrder } = require('./transform');
const { normalizeAliases } = require('./alias');

const normalizeModels = function ({ idl, idl: { models: oModels } }) {
  const models = mapValues(oModels, (oModel, modelName) =>
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
  return Object.assign({}, idl, { models });
};

const reduceModels = function ({ transformer, model, modelName, idl }) {
  if (!model || model.constructor !== Object) { return model; }

  const newModel = transformer(model, { modelName, idl });
  return Object.assign({}, model, newModel);
};

const transformers = [
  addModelDefaultType,
  addModelName,
  normalizeCommands,
  setTransformOrder,
  setComputeOrder,
  normalizeAliases,
];

module.exports = {
  normalizeModels,
};
