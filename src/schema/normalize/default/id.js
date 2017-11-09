'use strict';

// Add default `coll.id` attribute
const addDefaultId = function (coll) {
  const { attributes, attributes: { id } } = coll;
  if (id !== undefined) { return coll; }

  return {
    ...coll,
    attributes: {
      ...attributes,
      id: { description: 'Unique identifier' },
    },
  };
};

module.exports = {
  addDefaultId,
};
