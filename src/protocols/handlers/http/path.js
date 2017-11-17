'use strict';

// Retrieves path without query string nor hash
const getPath = function ({ specific: { req: { url } } }) {
  return url.replace(/[?#].*/, '');
};

module.exports = {
  getPath,
};
