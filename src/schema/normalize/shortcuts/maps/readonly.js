'use strict';

const mapAttr = ({ readonly }) => readonly;

// Gets a map of models' readonly attributes,
// e.g. { my_model: { attribute: 'readonly_value', ... }, ... }
const readonlyMap = { filter: 'readonly', mapAttr };

module.exports = {
  readonlyMap,
};
