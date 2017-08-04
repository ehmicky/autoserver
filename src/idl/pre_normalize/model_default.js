'use strict';

const { merge } = require('lodash');

const { omit, mapValues } = require('../../utilities');

// Applies `idl.default` to each model
const applyModelDefault = function ({
  idl,
  idl: { models, models: { default: modelsDefault } = {} },
}) {
  if (!modelsDefault) { return idl; }

  const modelsA = mapValues(models, model => {
    if (!model || typeof model !== 'object') { return model; }

    return merge({}, modelsDefault, model);
  });
  const modelsB = omit(modelsA, 'default');

  return { ...idl, models: modelsB };
};

module.exports = {
  applyModelDefault,
};
