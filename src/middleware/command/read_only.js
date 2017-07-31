'use strict';

const { omit } = require('../../utilities');

/**
 * Removes attributes marked in IDL as `readOnly`.
 * This is done silently (i.e. does not raise warnings or errors),
 * because readonly attributes can be part of a normal response, and clients
 * should be able to send responses back as is without having to remove
 * readonly attributes.
 **/
const handleReadOnly = async function (nextFunc, input) {
  const inputA = applyReadOnly({ input });

  const response = await nextFunc(inputA);
  return response;
};

// Remove readonly attributes in `args.newData`
const applyReadOnly = function ({
  input,
  input: {
    args,
    args: { newData },
    modelName,
    idl: { shortcuts: { readOnlyMap } },
  },
}) {
  if (!newData) { return input; }

  const readOnlyAttrs = readOnlyMap[modelName];
  const newDataA = Array.isArray(newData)
    ? newData.map(datum => removeReadOnly({ newData: datum, readOnlyAttrs }))
    : removeReadOnly({ newData, readOnlyAttrs });

  return { ...input, args: { ...args, newData: newDataA } };
};

const removeReadOnly = function ({ newData, readOnlyAttrs }) {
  return omit(newData, readOnlyAttrs);
};

module.exports = {
  handleReadOnly,
};
