'use strict';

const { omit, mapValues, deepMerge } = require('../../utilities');

// Applies `idl.default` to each model
const applyModelDefault = function ({
  idl,
  idl: { models, models: { default: modelsDefault } = {} },
}) {
  if (!modelsDefault) { return idl; }

  const modelsA = mapValues(models, model => {
    if (!model || typeof model !== 'object') { return model; }

    return deepMerge(modelsDefault, model);
  });
  const modelsB = omit(modelsA, 'default');

  return { ...idl, models: modelsB };
};

module.exports = {
  applyModelDefault,
};
