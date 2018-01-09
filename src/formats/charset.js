'use strict';

// Retrieves format's prefered charset
const getCharset = function ({ charsets: [charset] = [] }) {
  return charset;
};

// Checks if charset is supported by format
const hasCharset = function ({ charsets }, charset) {
  return charsets === undefined || charsets.includes(charset);
};

module.exports = {
  getCharset,
  hasCharset,
};
