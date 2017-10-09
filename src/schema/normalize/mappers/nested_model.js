'use strict';

// Copy `attr.type|description` to nested models
// from the `model.id` they refer to
const mergeNestedModel = function (attr, { schema: { models } }) {
  if (attr.target === undefined) { return attr; }

  const [, model] = Object.entries(models)
    .find(([name, mod]) => mod.model === attr.target || name === attr.target);

  const { type } = model.attributes.id;
  const description = attr.description || model.description;

  return { ...attr, type, description };
};

module.exports = {
  mergeNestedModel,
};
