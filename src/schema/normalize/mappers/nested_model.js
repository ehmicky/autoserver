'use strict';

// Copy `attr.type|description` to nested models
// from the `coll.id` they refer to
const mergeNestedModel = function (attr, { schema: { collections } }) {
  if (attr.target === undefined) { return attr; }

  const [, collA] = Object.entries(collections)
    .find(([name, coll]) => coll.model === attr.target || name === attr.target);

  const { type } = collA.attributes.id;
  const description = attr.description || collA.description;

  return { ...attr, type, description };
};

module.exports = {
  mergeNestedModel,
};
