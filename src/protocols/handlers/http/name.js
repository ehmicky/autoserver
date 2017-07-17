'use strict';

// Protocol name, without version
const name = 'HTTP';

// Protocol name, with version
const getFullName = function ({ specific: { req: { httpVersion } } }) {
  return `HTTP/${httpVersion}`;
};

module.exports = {
  name,
  getFullName,
};
