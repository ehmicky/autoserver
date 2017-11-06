'use strict';

// Default `model.model` to parent key
const addDefaultModelname = function (model, { modelname }) {
  if (model.model) { return model; }

  return { ...model, model: modelname };
};

module.exports = {
  addDefaultModelname,
};
