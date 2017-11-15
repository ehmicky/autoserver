'use strict';

const { transtype, recurseMap } = require('../utilities');

// All formats must be JSON-compatible.
// Depending on format.jsonCompat:
//  - 'subset': means array, object, strings are supported, but numbers,
//    booleans or null might not be supported, so they are transtyped from
//    string on parsing, and transtyped back to string on serializing
//  - 'superset': supports some types not allowed in JSON.
//    Those extra types are removed by being JSON serialized.
// Formats that do not support arrays, objects or strings cannot be specified.

const subsetParse = function (value) {
  return recurseMap(value, transtype);
};

const subsetSerialize = function (value) {
  return recurseMap(value, setToString);
};

const setToString = function (val) {
  // Strings are kept as is, unless they would be parsed back to a number,
  // boolean or null
  const noJsonNeeded = typeof val === 'string' && transtype(val) === val;
  if (noJsonNeeded) { return val; }

  return JSON.stringify(val);
};

const supersetParseStringify = function (value) {
  return JSON.parse(JSON.stringify(value));
};

const jsonCompatParse = {
  subset: subsetParse,
  superset: supersetParseStringify,
};

const jsonCompatSerialize = {
  subset: subsetSerialize,
  superset: supersetParseStringify,
};

module.exports = {
  jsonCompatParse,
  jsonCompatSerialize,
};
