'use strict';

const mapAttr = ({ value }) => value;

// Gets a map of models' `value`
// e.g. { my_model: { attrName: value, ... }, ... }
const valuesMap = { filter: 'value', mapAttr };

module.exports = {
  valuesMap,
};
