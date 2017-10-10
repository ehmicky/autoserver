'use strict';

const { invert, mapKeys } = require('../../../../utilities');

// Name shortcuts, e.g. { filter: value } -> { f: value }
const addNameShortcuts = function (token) {
  return mapKeys(
    token,
    (value, attrName) => shortcuts[attrName] || attrName,
  );
};

const removeNameShortcuts = function (token) {
  return mapKeys(token, (value, attrName) =>
    reverseShortcuts[attrName] || attrName);
};

const shortcuts = {
  filter: 'f',
  orderBy: 'o',
  parts: 'p',
};

const reverseShortcuts = invert(shortcuts);

module.exports = {
  addNameShortcuts,
  removeNameShortcuts,
};
