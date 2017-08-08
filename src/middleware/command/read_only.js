'use strict';

const { omit } = require('../../utilities');

// Removes attributes marked in IDL as `readonly`.
// This is done silently (i.e. does not raise warnings or errors),
// because readonly attributes can be part of a normal response, and clients
// should be able to send responses back as is without having to remove
// readonly attributes.
const handleReadonly = async function (nextFunc, input) {
  const inputA = applyReadonly({ input });

  const response = await nextFunc(inputA);
  return response;
};

// Remove readonly attributes in `args.newData`
const applyReadonly = function ({
  input,
  input: {
    args,
    args: { newData },
    modelName,
    idl: { shortcuts: { readonlyMap } },
  },
}) {
  if (!newData) { return input; }

  const readonlyAttrs = readonlyMap[modelName];
  const newDataA = Array.isArray(newData)
    ? newData.map(datum => removeReadonly({ newData: datum, readonlyAttrs }))
    : removeReadonly({ newData, readonlyAttrs });

  return { ...input, args: { ...args, newData: newDataA } };
};

const removeReadonly = function ({ newData, readonlyAttrs }) {
  return omit(newData, readonlyAttrs);
};

module.exports = {
  handleReadonly,
};
