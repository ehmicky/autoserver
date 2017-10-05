'use strict';

// Add default `model.id` attribute
const addDefaultId = function (model) {
  const { attributes, attributes: { id } } = model;
  if (id !== undefined) { return model; }

  return {
    ...model,
    attributes: {
      ...attributes,
      id: { description: 'Unique identifier' },
    },
  };
};

module.exports = {
  addDefaultId,
};
