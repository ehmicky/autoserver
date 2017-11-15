'use strict';

const ini = require('ini');

const { fullRecurseMap } = require('../../utilities');

// Parses an INI file
const parse = function ({ content }) {
  return ini.parse(content);
};

// Serializes an INI file
const serialize = function ({ content }) {
  const contentA = fullRecurseMap(content, escapeEmptyArrays);
  return ini.stringify(contentA);
};

// Empty arrays are ignored by `node-ini`, so we need to escape them
const escapeEmptyArrays = function (val) {
  const isEmptyArray = Array.isArray(val) && val.length === 0;
  if (!isEmptyArray) { return val; }

  return '[]';
};

module.exports = {
  name: 'ini',
  title: 'INI',
  types: ['conf'],
  extNames: ['ini', 'in', 'cfg', 'conf'],
  mimes: [],
  // `node-ini` only supports UTF-8
  charsets: ['utf-8'],
  jsonCompat: ['subset'],
  parse,
  serialize,
};
