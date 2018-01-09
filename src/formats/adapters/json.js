'use strict';

// Parses a JSON file
const parse = function ({ content }) {
  return JSON.parse(content);
};

// Serializes a JSON file
const serialize = function ({ content }) {
  return JSON.stringify(content, null, 2);
};

module.exports = {
  name: 'json',
  title: 'JSON',
  extensions: ['json'],
  mimes: ['application/json'],
  mimeExtensions: ['+json'],
  charsets: ['utf-8'],
  jsonCompat: [],
  parse,
  serialize,
};
