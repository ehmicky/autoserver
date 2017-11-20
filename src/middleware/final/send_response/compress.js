'use strict';

const compressible = require('compressible');

const { addGenErrorHandler } = require('../../../error');
const { OBJECT_TYPES } = require('../../../constants');

// Response body compression
const compressContent = async function ({ content, type, compress, mime }) {
  const noCompression = !shouldCompress({ compress, mime, type });

  if (noCompression) {
    // `compressName` is undefined, `content` is unchanged
    return { content };
  }

  const contentA = await compress.compress({ content });

  const { name: compressName } = compress;

  return { content: contentA, compressName };
};

const eCompressContent = addGenErrorHandler(compressContent, {
  message: ({ compress: { name } }) =>
    `Could not compress the response using the '${name}' algorithm`,
  reason: 'UTILITY_ERROR',
});

// Do not try to compress binary content types
const shouldCompress = function ({ compress, mime, type }) {
  if (compress === undefined) { return false; }

  // The `compressible` module is only used for non-model payloads
  return OBJECT_TYPES.includes(type) || compressible(mime);
};

module.exports = {
  compressContent: eCompressContent,
};
