'use strict';

const { getShortcut } = require('../../../helpers');

// Gets a map of collections' `value`
// e.g. { my_coll: { attrName: value, ... }, ... }
const valuesMap = function ({ schema }) {
  return getShortcut({ schema, filter: 'value', mapper });
};

const mapper = ({ value }) => value;

module.exports = {
  valuesMap,
};
