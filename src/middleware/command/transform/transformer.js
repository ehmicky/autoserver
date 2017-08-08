'use strict';

const { mapValues } = require('../../../utilities');
const { runJsl } = require('../../../jsl');

const applyInputTransforms = function ({
  input,
  input: { args, args: { newData } },
}) {
  if (!newData) { return input; }

  const newDataA = transformData({ data: newData, input, type: 'transform' });
  const newDataB = transformData({ data: newDataA, input, type: 'value' });

  return { ...input, args: { ...args, newData: newDataB } };
};

const applyOutputTransforms = function ({
  input,
  response,
  response: { data },
}) {
  if (!data) { return response; }

  const dataA = transformData({ data, input, type: 'compute' });

  return { ...response, data: dataA };
};

// Performs transformation on data array or single data
const transformData = function ({
  data,
  input,
  input: { idl: { shortcuts }, modelName },
  type,
}) {
  const transformMap = shortcuts[mapName[type]];
  const transforms = transformMap[modelName];

  return Array.isArray(data)
    ? data.map(
      datum => applyTransforms({ data: datum, transforms, input, type })
    )
    : applyTransforms({ data, transforms, input, type });
};

const mapName = {
  transform: 'transformsMap',
  compute: 'computesMap',
  value: 'valuesMap',
};

// There can be transform for each attribute
const applyTransforms = function ({ data, transforms, input, type }) {
  const transformedData = mapValues(
    transforms,
    (transform, attrName) =>
      applyTransform({ data, attrName, transform, input, type })
  );
  return { ...data, ...transformedData };
};

const applyTransform = function ({
  data,
  attrName,
  transform,
  input: { jsl, idl },
  type,
}) {
  const currentVal = data[attrName];

  // `transform` (as opposed to `value`) is skipped when there is
  // no value to transform
  if (type === 'transform' && currentVal == null) { return currentVal; }

  const params = getTransformParams({ data, currentVal, type });
  const valueA = runJsl({ jsl, value: transform, params, idl });

  // Returning `null` or `undefined` with `compute` or `value` is a way
  // to ignore that return value.
  const isIgnored = ['compute', 'value'].includes(type) && valueA == null;
  if (isIgnored) { return currentVal; }

  return valueA;
};

const getTransformParams = function ({ data, currentVal, type }) {
  // `compute` cannot use $ in JSL, because the model is not persisted
  // `value` cannot use $ in JSL, because it does not transform it
  // (as opposed to `transform`) but creates a new value independently of
  // the current value.
  if (['compute', 'value'].includes(type)) { return { $$: data }; }

  return { $$: data, $: currentVal };
};

module.exports = {
  applyInputTransforms,
  applyOutputTransforms,
};
