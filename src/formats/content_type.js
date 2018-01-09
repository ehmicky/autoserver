'use strict';

const { parse, format: formatContentType } = require('content-type');

const { formatAdapters } = require('./wrap');

// Parse MIME and charset, such as the one in Content-Type HTTP headers
const parseContentType = function ({ contentType }) {
  if (!contentType) { return {}; }

  const { type: mime, parameters: { charset } = {} } = parse(contentType);

  return { mime, charset };
};

// Inverse
const serializeContentType = function ({ mime, charset, format }) {
  const formatA = formatAdapters[format.name];
  const type = getMime({ mime, format: formatA });
  const mimeA = formatContentType({ type, parameters: { charset } });
  return mimeA;
};

// Add default MIME if missing, and fill in MIME extension
const getMime = function ({
  mime,
  format: { mimes = [], mimeExtensions = [] } = {},
}) {
  // Default to format's prefered MIME
  if (mime === undefined) {
    return mimes[0];
  }

  if (mime.endsWith('+')) {
    return addMimeExtension({ mime, mimes, mimeExtensions });
  }

  return mime;
};

// If MIME ends with `+`, add format's extension
// If it does not have any, use format's prefered MIME instead
const addMimeExtension = function ({
  mime,
  mimes,
  mimeExtensions: [mimeExtension],
}) {
  if (mimeExtension === undefined) {
    return mimes[0];
  }

  return `${mime}${mimeExtension.slice(1)}`;
};

module.exports = {
  parseContentType,
  serializeContentType,
};
