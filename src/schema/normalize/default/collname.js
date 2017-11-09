'use strict';

// Default `model.model` to parent key
const addDefaultCollname = function (model, { collname }) {
  if (model.model) { return model; }

  return { ...model, model: collname };
};

module.exports = {
  addDefaultCollname,
};
