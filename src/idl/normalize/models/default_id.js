'use strict';

// Add model.id if it does not exist
const addDefaultId = function (model) {
  const { attributes, attributes: { id } } = model;
  if (id !== undefined) { return model; }

  return { ...model, attributes: { ...attributes, id: {} } };
};

module.exports = {
  addDefaultId,
};
