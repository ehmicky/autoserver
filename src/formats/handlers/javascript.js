'use strict';

const requireFromString = require('require-from-string');

// Parses a JavaScript file
const parse = function ({ content, path }) {
  if (typeof path === 'string') {
    // eslint-disable-next-line import/no-dynamic-require
    return require(path);
  }

  return requireFromString(content);
};

// Serializes a JavaScript file
const serialize = function ({ content }) {
  const json = JSON.stringify(content, null, 2);
  return `module.exports = ${json}`;
};

module.exports = {
  name: 'javascript',
  title: 'JavaScript',
  types: ['conf'],
  extNames: ['js', 'mjs'],
  mimes: [
    'application/javascript',
    'application/x-javascript',
    'application/ecmascript',
    'text/javascript',
    'text/ecmascript',
    '+js',
    '+mjs',
  ],
  charsets: ['utf-8'],
  jsonCompat: ['superset'],
  parse,
  serialize,
};
