'use strict';

const { mapValues } = require('../../../utilities');
const { runIdlFunc } = require('../../../idl_func');

// Performs transformation on data array or single data
const transformData = function ({
  data,
  idl: { shortcuts },
  modelName,
  mInput,
  type,
}) {
  const transformMap = shortcuts[mapName[type]];
  const transforms = transformMap[modelName];

  return data
    .map(datum => applyTransforms({ data: datum, transforms, mInput, type }));
};

const mapName = {
  transform: 'transformsMap',
  value: 'valuesMap',
};

// There can be transform for each attribute
const applyTransforms = function ({ data, transforms, mInput, type }) {
  const transformedData = mapValues(
    transforms,
    (transform, attrName) =>
      applyTransform({ data, attrName, transform, mInput, type })
  );
  return { ...data, ...transformedData };
};

const applyTransform = function ({ data, attrName, transform, mInput, type }) {
  const currentVal = data[attrName];

  // `transform` (as opposed to `value`) is skipped when there is
  // no value to transform
  if (type === 'transform' && currentVal == null) { return currentVal; }

  const vars = getTransformVars({ data, currentVal, type });
  const valueA = runIdlFunc({ idlFunc: transform, mInput, vars });

  // Returning `null` or `undefined` with `value` is a way
  // to ignore that return value.
  const isIgnored = type === 'value' && valueA == null;
  if (isIgnored) { return currentVal; }

  return valueA;
};

const getTransformVars = function ({ data, currentVal, type }) {
  // `value` cannot use $ in IDL functions, because it does not transform it
  // (as opposed to `transform`) but creates a new value independently of
  // the current value.
  if (type === 'value') { return { $$: data }; }

  return { $$: data, $: currentVal };
};

module.exports = {
  transformData,
};
