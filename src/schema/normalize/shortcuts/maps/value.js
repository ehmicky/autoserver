'use strict';

const mapAttr = ({ value }) => value;

// Gets a map of collections' `value`
// e.g. { my_coll: { attrName: value, ... }, ... }
const valuesMap = { filter: 'value', mapAttr };

module.exports = {
  valuesMap,
};
