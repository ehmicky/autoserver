'use strict';

const json5 = require('json5');

// Parses a JSON5 file
const parse = function ({ content }) {
  return json5.parse(content);
};

// Serializes a JSON5 file
const serialize = function ({ content }) {
  return json5.stringify(content, null, 2);
};

module.exports = {
  name: 'json5',
  title: 'JSON5',
  types: ['conf', 'payload', 'db'],
  extNames: ['json5'],
  mimes: [
    'application/json5',
    '+json5',
  ],
  charsets: ['utf-8', 'utf-16', 'utf-16be', 'utf-16le'],
  jsonCompat: ['superset'],
  parse,
  serialize,
};
