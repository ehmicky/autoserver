'use strict';

const { isEqual } = require('lodash');

const { mapValues } = require('../../../utilities');
const { throwError } = require('../../../error');
const { runIdlFunc } = require('../../../idl_func');

// Performs transformation on data array or single data
const transformData = function ({
  data,
  deepKeys,
  idl: { shortcuts },
  modelName,
  mInput,
  type,
}) {
  const transformMap = shortcuts[mapName[type]];
  const transforms = transformMap[modelName];

  return data.map((datum, index) => applyTransforms({
    data: datum,
    deepKeys: deepKeys[index],
    transforms,
    mInput,
    type,
  }));
};

const mapName = {
  transform: 'transformsMap',
  value: 'valuesMap',
};

// There can be transform for each attribute
const applyTransforms = function ({
  data,
  deepKeys,
  transforms,
  mInput,
  type,
}) {
  const transformedData = mapValues(
    transforms,
    (transform, attrName) => applyTransform({
      data,
      deepKeys,
      attrName,
      transform,
      mInput,
      type,
    }),
  );
  return { ...data, ...transformedData };
};

const applyTransform = function ({
  data,
  deepKeys,
  attrName,
  transform,
  mInput,
  type,
}) {
  const currentVal = data[attrName];

  // `transform` (as opposed to `value`) is skipped when there is
  // no value to transform
  if (type === 'transform' && currentVal == null) { return currentVal; }

  // `value` cannot use $ in IDL functions, because it does not transform it
  // (as opposed to `transform`) but creates a new value independently of
  // the current value.
  const vars = type === 'value'
    ? { $$: data }
    : { $$: data, $: currentVal };
  const valueA = runIdlFunc({ idlFunc: transform, mInput, vars });

  validateReturnValue({ data, currentVal, newVal: valueA, deepKeys, attrName });

  return valueA;
};

// Nested relations attributes are special, as `attr.transform|value` should
// not modify them if the client used them to perform a nested action.
// Check `deepKeys` code for more information.
const validateReturnValue = function ({
  data: { id },
  currentVal,
  newVal,
  deepKeys,
  attrName,
}) {
  if (!deepKeys.includes(attrName)) { return; }

  if (isEqual(currentVal, newVal)) { return; }

  const message = `The server modified the attribute '${attrName}' from '${JSON.stringify(currentVal)}' to '${JSON.stringify(newVal)}' of the model with id '${id}' while the client used that attribute to perform a nested action`;
  throwError(message, { reason: 'UTILITY_ERROR' });
};

module.exports = {
  transformData,
};
