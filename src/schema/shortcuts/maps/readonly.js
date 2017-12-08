'use strict';

const mapAttr = ({ readonly }) => readonly;

// Gets a map of collections' readonly attributes,
// e.g. { my_coll: { attribute: 'readonly_value', ... }, ... }
const readonlyMap = { filter: 'readonly', mapAttr };

module.exports = {
  readonlyMap,
};
