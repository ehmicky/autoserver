'use strict';

const { parseContentType } = require('../../../../formats');

// Parse HTTP header `Content-Type`
const getContentType = function ({ specific: { req: { headers } } }) {
  const contentType = headers['content-type'];
  return parseContentType({ contentType });
};

module.exports = {
  getContentType,
};
