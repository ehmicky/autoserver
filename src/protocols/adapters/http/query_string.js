'use strict';

const { URL } = require('url');

// Retrieves query string from a URL
const getQueryString = function ({ specific: { req: { url } } }) {
  const { search = '' } = new URL(`http://localhost/${url}`);
  return search;
};

module.exports = {
  getQueryString,
};
