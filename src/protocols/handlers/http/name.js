'use strict';

// Protocol name, without version
const name = 'http';

// Human-friendly protocol name
const title = 'HTTP';

// Protocol name, with version
const getFullName = function ({ specific: { req: { httpVersion } } }) {
  return `HTTP/${httpVersion}`;
};

module.exports = {
  name,
  title,
  getFullName,
};
