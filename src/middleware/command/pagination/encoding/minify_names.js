'use strict';

const { invert, mapKeys } = require('../../../../utilities');

// Name shortcuts, e.g. { nFilter: value } -> { f: value }
const addNameShortcuts = function (token) {
  return mapKeys(token, (value, attrName) =>
    shortcuts[attrName] || attrName
  );
};

const removeNameShortcuts = function (token) {
  return mapKeys(token, (value, attrName) =>
    reverseShortcuts[attrName] || attrName
  );
};

const shortcuts = {
  nFilter: 'f',
  nOrderBy: 'o',
  parts: 'p',
};

const reverseShortcuts = invert(shortcuts);

module.exports = {
  addNameShortcuts,
  removeNameShortcuts,
};
