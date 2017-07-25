'use strict';

const { omit } = require('../../../utilities');

// Shallow copy nested models from the `model.id` they refer to
const mergeNestedModel = function (attr, { idl: { models } }) {
  if (!attr.model) { return; }

  const [, model] = Object.entries(models)
    .find(([name, mod]) => mod.model === attr.model || name === attr.model);
  const modelId = model.properties.id;
  // Any specified property has higher priority
  const referedModelId = omit(modelId, Object.keys(attr));
  return referedModelId;
};

module.exports = {
  mergeNestedModel,
};
