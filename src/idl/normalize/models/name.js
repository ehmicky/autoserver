'use strict';

// Default `model.model` to parent key
const addModelName = function ({ model }, { modelName }) {
  if (model) { return; }

  return { model: modelName };
};

module.exports = {
  addModelName,
};
