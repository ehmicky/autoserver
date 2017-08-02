'use strict';

const { omit, deepMerge } = require('../../../utilities');

// Shallow copy nested models from the `model.id` they refer to
const mergeNestedModel = function (attr, { idl: { models } }) {
  if (!attr.model) { return; }

  const [, model] = Object.entries(models)
    .find(([name, mod]) => mod.model === attr.model || name === attr.model);
  const modelId = model.properties.id;

  const modelIdA = omit(modelId, metadataProps);
  const validate = omit(modelIdA.validate, nestedValidateProps);
  const modelIdB = { ...modelIdA, validate };

  const modelIdC = deepMerge(modelIdB, attr);
  return modelIdC;
};

// Never using target model for those properties
const metadataProps = [
  'description',
  'deprecated',
  'examples',
];

const nestedValidateProps = [
  'required',
  'dependencies',
];

module.exports = {
  mergeNestedModel,
};
