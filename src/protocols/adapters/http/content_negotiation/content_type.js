'use strict';

const { parse: parseContentType } = require('content-type');

// Parse HTTP header `Content-Type`
const getContentType = function ({ specific: { req: { headers } } }) {
  const contentType = headers['content-type'];
  if (!contentType) { return {}; }

  const {
    type: mime,
    parameters: { charset } = {},
  } = parseContentType(contentType);
  return { mime, charset };
};

module.exports = {
  getContentType,
};
