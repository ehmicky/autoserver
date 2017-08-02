'use strict';

// Add model.id if it does not exist
const addDefaultId = function (model) {
  const { properties, properties: { id } } = model;
  if (id !== undefined) { return model; }

  return { ...model, properties: { ...properties, id: {} } };
};

module.exports = {
  addDefaultId,
};
