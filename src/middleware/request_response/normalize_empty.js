'use strict';

const { pickBy, omit } = require('../../utilities');

// Normalize empty values (undefined, null) by removing their key
const normalizeEmpty = function ({ args, args: { newData } }) {
  if (!newData) { return; }

  const newDataA = newData.map(removeEmpty);
  return { args: { ...args, newData: newDataA } };
};

const removeEmpty = function (newData) {
  const emptyAttrs = pickBy(newData, value => value == null);
  const emptyAttrsKeys = Object.keys(emptyAttrs);

  return omit(newData, emptyAttrsKeys);
};

module.exports = {
  normalizeEmpty,
};
