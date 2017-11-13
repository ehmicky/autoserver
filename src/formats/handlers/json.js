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
  types: ['conf', 'payload', 'db'],
  extNames: ['json'],
  mimes: ['application/json', '+json'],
  // JSON specification also allows UTF-32, but iconv-lite does not support it
  charsets: ['utf-8', 'utf-16', 'utf-16be', 'utf-16le'],
  parse,
  serialize,
};
