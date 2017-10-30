'use strict';

const { omit, mapValues, deepMerge } = require('../../utilities');

// Applies `schema.models.default` to each model
const applyModelsDefault = function ({
  schema,
  schema: { models = {}, models: { default: modelsDefault } = {} },
}) {
  const modelsA = omit(models, ['default']);
  const modelsB = mapValues(
    modelsA,
    model => applyModelDefault({ model, modelsDefault }),
  );

  return { ...schema, models: modelsB };
};

const applyModelDefault = function ({ model, modelsDefault }) {
  const shouldApply = isProperModel(modelsDefault) && isProperModel(model);
  if (!shouldApply) { return model; }

  return deepMerge(modelsDefault, model);
};

const isProperModel = function (model) {
  return model != null && typeof model === 'object';
};

module.exports = {
  applyModelsDefault,
};
