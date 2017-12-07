'use strict';

const hjson = require('hjson');

// Parses a HJSON file
const parse = function ({ content }) {
  return hjson.parse(content);
};

// Serializes a HJSON file
const serialize = function ({ content }) {
  return hjson.stringify(content, { bracesSameLine: true });
};

module.exports = {
  name: 'hjson',
  title: 'Hjson',
  types: ['conf', 'payload', 'db'],
  extNames: ['hjson'],
  mimes: ['application/hjson', 'text/hjson'],
  mimeExtensions: ['+hjson'],
  charsets: ['utf-8'],
  jsonCompat: [],
  parse,
  serialize,
};
