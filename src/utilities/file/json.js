'use strict';

// Parses a JSON file
const loadJson = function ({ content }) {
  return JSON.parse(content);
};

module.exports = {
  loadJson,
};
