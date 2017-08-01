'use strict';

const { omit, deepMerge } = require('../../../utilities');

// Shallow copy nested models from the `model.id` they refer to
const mergeNestedModel = function (attr, { idl: { models } }) {
  if (!attr.model) { return; }

  const [, model] = Object.entries(models)
    .find(([name, mod]) => mod.model === attr.model || name === attr.model);
  const modelId = model.properties.id;

  const attrA = omit(attr, 'model');

  const validate = omit(modelId.validate, ['required']);
  const modelIdA = { ...modelId, validate };

  const modelIdB = deepMerge(modelIdA, attrA);
  return modelIdB;
};

module.exports = {
  mergeNestedModel,
};
