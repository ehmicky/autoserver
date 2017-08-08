'use strict';

const { mapValues } = require('../../../utilities');
const { runJsl } = require('../../../jsl');

const applyInputTransforms = function ({
  input,
  input: { args, args: { newData }, modelName, jsl, idl },
}) {
  if (!newData) { return input; }

  const type = 'transform';
  const transforms = getTransforms({ idl, type, modelName });
  const data = newData;

  const newDataA = applyTransformsOnData({ data, transforms, jsl, idl, type });
  return { ...input, args: { ...args, newData: newDataA } };
};

const applyOutputTransforms = function ({
  input: { modelName, jsl, idl },
  response,
  response: { data },
}) {
  if (!data) { return response; }

  const type = 'compute';
  const transforms = getTransforms({ idl, type, modelName });

  const dataA = applyTransformsOnData({ data, transforms, jsl, idl, type });
  return { ...response, data: dataA };
};

const getTransforms = function ({
  idl: { shortcuts: { transformsMap, computesMap } },
  type,
  modelName,
}) {
  return type === 'compute' ? computesMap[modelName] : transformsMap[modelName];
};

// Performs transformation on data array or single data
const applyTransformsOnData = function ({ data, transforms, jsl, idl, type }) {
  return Array.isArray(data)
    ? data.map(
      datum => applyTransforms({ data: datum, transforms, jsl, idl, type })
    )
    : applyTransforms({ data, transforms, jsl, idl, type });
};

// There can be transform for each attribute
const applyTransforms = function ({ data, transforms, jsl, idl, type }) {
  const transformedData = mapValues(
    transforms,
    (transform, attrName) =>
      applyTransform({ data, attrName, transform, jsl, idl, type })
  );
  return { ...data, ...transformedData };
};

const applyTransform = function ({
  data,
  attrName,
  transform,
  jsl,
  idl,
  type,
}) {
  const params = getTransformParams({ data, attrName, type });
  const valueA = runJsl({ jsl, value: transform, params, idl });

  return valueA;
};

const getTransformParams = function ({ data, attrName, type }) {
  // `compute` cannot use $ in JSL, because the model is not persisted
  if (type === 'compute') { return { $$: data }; }

  return { $$: data, $: data[attrName] };
};

module.exports = {
  applyInputTransforms,
  applyOutputTransforms,
};
