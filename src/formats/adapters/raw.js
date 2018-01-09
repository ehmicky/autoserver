'use strict';

const { Buffer: { isBuffer } } = require('buffer');

// Parses a raw value
const parse = function ({ content }) {
  return content;
};

// Serializes any value to a string
const serialize = function ({ content }) {
  if (typeof content === 'string') { return content; }

  if (isBuffer(content)) { return content.toString(); }

  return JSON.stringify(content, null, 2);
};

// Means this is not a structured type, like media types,
// and unlike JSON or YAML
// This won't be parsed (i.e. returned as is), and will use 'binary' charset
module.exports = {
  name: 'raw',
  title: 'raw',
  extNames: [],
  mimes: [],
  jsonCompat: [],
  parse,
  serialize,
};
