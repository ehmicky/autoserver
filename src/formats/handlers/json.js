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
  extNames: ['json'],
  parse,
  serialize,
};
