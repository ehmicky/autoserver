'use strict';

// Protocol name, with version
const getFullName = function ({ specific: { req: { httpVersion } } }) {
  return `HTTP/${httpVersion}`;
};

module.exports = {
  getFullName,
};
