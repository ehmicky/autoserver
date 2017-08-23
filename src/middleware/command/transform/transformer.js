'use strict';

const { mapValues } = require('../../../utilities');
const { addIfv, runIdlFunc } = require('../../../idl_func');

// Performs transformation on data array or single data
const transformData = function ({
  data,
  idl: { shortcuts },
  modelName,
  ifv,
  type,
}) {
  const transformMap = shortcuts[mapName[type]];
  const transforms = transformMap[modelName];

  return Array.isArray(data)
    ? data.map(
      datum => applyTransforms({ data: datum, transforms, ifv, type })
    )
    : applyTransforms({ data, transforms, ifv, type });
};

const mapName = {
  transform: 'transformsMap',
  compute: 'computesMap',
  value: 'valuesMap',
};

// There can be transform for each attribute
const applyTransforms = function ({ data, transforms, ifv, type }) {
  const transformedData = mapValues(
    transforms,
    (transform, attrName) =>
      applyTransform({ data, attrName, transform, ifv, type })
  );
  return { ...data, ...transformedData };
};

const applyTransform = function ({ data, attrName, transform, ifv, type }) {
  const currentVal = data[attrName];

  // `transform` (as opposed to `value`) is skipped when there is
  // no value to transform
  if (type === 'transform' && currentVal == null) { return currentVal; }

  const params = getTransformParams({ data, currentVal, type });
  const ifvA = addIfv(ifv, params);
  const valueA = runIdlFunc({ ifv: ifvA, idlFunc: transform });

  // Returning `null` or `undefined` with `compute` or `value` is a way
  // to ignore that return value.
  const isIgnored = ['compute', 'value'].includes(type) && valueA == null;
  if (isIgnored) { return currentVal; }

  return valueA;
};

const getTransformParams = function ({ data, currentVal, type }) {
  // `compute` cannot use $ in IDL functions, because the model is not persisted
  // `value` cannot use $ in IDL functions, because it does not transform it
  // (as opposed to `transform`) but creates a new value independently of
  // the current value.
  if (['compute', 'value'].includes(type)) { return { $$: data }; }

  return { $$: data, $: currentVal };
};

module.exports = {
  transformData,
};
