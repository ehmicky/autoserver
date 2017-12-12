'use strict';

const { getShortcut } = require('../../../helpers');

// Gets a map of collections' readonly attributes,
// e.g. { my_coll: { attribute: 'readonly_value', ... }, ... }
const readonlyMap = function ({ config }) {
  return getShortcut({ config, filter: 'readonly', mapper });
};

const mapper = ({ readonly }) => readonly;

module.exports = {
  readonlyMap,
};
