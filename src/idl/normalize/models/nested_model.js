'use strict';

const { pick, omit, deepMerge } = require('../../../utilities');

// Shallow copy nested models from the `model.id` they refer to
const mergeNestedModel = function (attr, { idl: { models } }) {
  if (attr.target === undefined) { return attr; }

  const [, model] = Object.entries(models)
    .find(([name, mod]) => mod.model === attr.target || name === attr.target);
  const modelId = getTargetModelId({ model });

  // Target model has less priority than nested attribute
  const modelIdA = deepMerge(modelId, attr);

  return modelIdA;
};

const getTargetModelId = function ({ model }) {
  const modelId = model.properties.id;

  // For the metadata, use target model, not target model.id
  const modelIdA = omit(modelId, metadataProps);
  const modelMetadata = pick(model, metadataProps);
  const modelIdB = { ...modelIdA, ...modelMetadata };

  // Never using target model for those properties
  const validate = omit(modelIdB.validate, nestedValidateProps);
  const modelIdC = { ...modelIdB, validate };

  return modelIdC;
};

const metadataProps = [
  'description',
  'deprecation_reason',
  'examples',
];

const nestedValidateProps = [
  'required',
  'dependencies',
];

module.exports = {
  mergeNestedModel,
};
