'use strict';

// Parses a JSON file
const parse = function ({ content }) {
  return JSON.parse(content);
};

module.exports = {
  name: 'json',
  title: 'JSON',
  extNames: ['json'],
  parse,
};
