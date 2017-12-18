'use strict';

const compressible = require('compressible');

const { addGenErrorHandler } = require('../../../error');
const { OBJECT_TYPES } = require('../../../constants');
const { DEFAULT_COMPRESS } = require('../../../compress');

// Response body compression
// Input and output is buffer
const compressContent = async function ({
  content,
  type,
  compressResponse,
  mime,
}) {
  const noCompression = !shouldCompress({ compressResponse, mime, type });

  if (noCompression) {
    // `compressName` is undefined, `content` is unchanged
    return { content };
  }

  const contentA = await compressResponse.compress({ content });

  const { name: compressName } = compressResponse;

  return { content: contentA, compressName };
};

const eCompressContent = addGenErrorHandler(compressContent, {
  message: ({ compressResponse: { title } }) =>
    `Could not compress the response using the ${title} algorithm`,
  reason: 'UTILITY',
});

// Do not try to compress binary content types
const shouldCompress = function ({ compressResponse, mime, type }) {
  return compressResponse !== undefined &&
    compressResponse.name !== DEFAULT_COMPRESS.name &&
    // The `compressible` module is only used for non-model payloads
    (OBJECT_TYPES.includes(type) || compressible(mime));
};

module.exports = {
  compressContent: eCompressContent,
};
