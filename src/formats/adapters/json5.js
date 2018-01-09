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
  extensions: ['json5'],
  mimes: ['application/json5'],
  mimeExtensions: ['+json5'],
  charsets: ['utf-8'],
  jsonCompat: ['superset'],
  parse,
  serialize,
};
