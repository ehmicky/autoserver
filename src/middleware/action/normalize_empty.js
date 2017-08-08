'use strict';

const { pickBy, omit } = require('../../utilities');

// Normalize empty values (undefined, null) by removing their key
const normalizeEmpty = async function (nextFunc, input) {
  const inputA = unsetEmpty({ input });

  const response = await nextFunc(inputA);
  return response;
};

const unsetEmpty = function ({
  input: { args, args: { newData } },
  input,
}) {
  if (!newData) { return input; }

  const newDataA = removeAllEmpty({ newData });
  return { ...input, args: { ...args, newData: newDataA } };
};

const removeAllEmpty = function ({ newData }) {
  if (Array.isArray(newData)) {
    return newData.map(newDatum => removeEmpty({ newData: newDatum }));
  }

  return removeEmpty({ newData });
};

const removeEmpty = function ({ newData }) {
  const emptyAttrs = pickBy(newData, value => value == null);
  const emptyAttrsKeys = Object.keys(emptyAttrs);

  return omit(newData, emptyAttrsKeys);
};

module.exports = {
  normalizeEmpty,
};
