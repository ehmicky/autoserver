'use strict';

const { omit } = require('../../../utilities');

// Shallow copy nested models from the `model.id` they refer to
const mergeNestedModel = function (attr, { idl: { models } }) {
  if (!attr.model) { return; }

  const [, model] = Object.entries(models)
    .find(([name, mod]) => mod.model === attr.model || name === attr.model);
  const modelId = model.properties.id;
  // Any specified property has higher priority
  const attrsToOmit = [...Object.keys(attr), ...nonNestedAttrs];
  const referedModelId = omit(modelId, attrsToOmit);
  return referedModelId;
};

// Those attributes never get deeply merged
const nonNestedAttrs = [
  'required',
];

module.exports = {
  mergeNestedModel,
};
