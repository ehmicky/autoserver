'use strict';

const { omit } = require('../../utilities');

// Sets attributes marked in IDL as `readonly` to their current value
// (i.e. `currentData`)
// This is done silently (i.e. does not raise warnings or errors),
// because readonly attributes can be part of a normal response, and clients
// should be able to send responses back as is without having to remove
// readonly attributes.
const handleReadonly = function (input) {
  const inputA = applyReadonly({ input });

  return inputA;
};

// `currentData` might be undefined, e.g. for command `create`
const applyReadonly = function ({
  input,
  input: {
    args,
    args: { newData, currentData = [] },
    modelName,
    idl: { shortcuts: { readonlyMap } },
  },
}) {
  if (!newData) { return input; }

  const attrs = readonlyMap[modelName];
  const newDataA = getNewData({ newData, currentData, attrs });

  return { ...input, args: { ...args, newData: newDataA } };
};

const getNewData = function ({ newData, currentData, attrs }) {
  if (Array.isArray(newData)) {
    return newData.map((newDatum, index) => removeAttrs({
      newData: newDatum,
      currentData: currentData[index],
      attrs,
    }));
  }

  return removeAttrs({ newData, currentData, attrs });
};

const removeAttrs = function ({ newData, currentData = {}, attrs }) {
  return attrs.reduce(
    (newDataA, attr) => removeAttr({ newData: newDataA, currentData, attr }),
    newData,
  );
};

const removeAttr = function ({ newData, currentData, attr }) {
  if (!currentData || currentData[attr] == null) {
    return omit(newData, attr);
  }

  return { ...newData, [attr]: currentData[attr] };
};

module.exports = {
  handleReadonly,
};
