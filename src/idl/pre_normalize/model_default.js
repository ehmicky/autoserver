'use strict';

const { merge } = require('lodash');

const { omit, mapValues } = require('../../utilities');

// Applies `idl.default` to each model
const applyModelDefault = function ({ idl }) {
  if (!idl.default) { return idl; }

  const { models, default: modelsDefault } = idl;
  const idlA = omit(idl, 'default');

  if (!models || typeof models !== 'object') { return idlA; }

  const modelsA = mapValues(models, model => {
    if (!model || typeof model !== 'object') { return model; }

    return merge({}, modelsDefault, model);
  });

  return { ...idlA, models: modelsA };
};

module.exports = {
  applyModelDefault,
};
