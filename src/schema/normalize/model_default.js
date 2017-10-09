'use strict';

const { omit, mapValues, deepMerge } = require('../../utilities');

// Applies `schema.model.default` to each model
const applyModelDefault = function ({
  schema,
  schema: { models, models: { default: modelsDefault } = {} },
}) {
  if (!modelsDefault) { return schema; }

  const modelsA = mapValues(models, model => {
    if (!model || typeof model !== 'object') { return model; }

    return deepMerge(modelsDefault, model);
  });
  const modelsB = omit(modelsA, 'default');

  return { ...schema, models: modelsB };
};

module.exports = {
  applyModelDefault,
};
