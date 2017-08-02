'use strict';

const { mapValues } = require('../../../utilities');

const { addModelName } = require('./name');
const { normalizeCommands } = require('./commands');
const { setTransformOrder, setComputeOrder } = require('./transform');
const { normalizeAliases } = require('./alias');

const normalizeModels = function (type, { idl, idl: { models } }) {
  const transformers = allTransformers[type];
  const modelsA = mapValues(models, (model, modelName) =>
    normalizeModel({ transformers, model, modelName, idl }),
  );
  return { ...idl, models: modelsA };
};

const normalizeModel = function ({ transformers, model, modelName, idl }) {
  return transformers.reduce(
    (modelA, transformer) => transformer(modelA, { modelName, idl }),
    model,
  );
};

// Do not use .bind() because we want a clean function name,
// because the performance monitoring uses it
const normalizeModelsBefore = (...args) => normalizeModels('before', ...args);
const normalizeModelsAfter = (...args) => normalizeModels('after', ...args);

const allTransformers = {
  before: [
    addModelName,
    normalizeCommands,
  ],
  after: [
    setTransformOrder,
    setComputeOrder,
    normalizeAliases,
  ],
};

module.exports = {
  normalizeModelsBefore,
  normalizeModelsAfter,
};
