'use strict';

// Default `model.model` to parent key
const addModelName = function (model, { modelName }) {
  if (model.model) { return model; }

  return { ...model, model: modelName };
};

module.exports = {
  addModelName,
};
