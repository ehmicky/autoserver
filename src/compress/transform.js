'use strict';

const { addGenErrorHandler } = require('../error');

const { compressAdapters } = require('./merger');
const { DEFAULT_ALGO } = require('./constants');

// Generic compression/decompression
// Input and output is buffer
const decompress = function ({ algo = DEFAULT_ALGO, content }) {
  return compressAdapters[algo].decompress({ content });
};

const eDecompress = addGenErrorHandler(decompress, {
  message: ({ algo }) =>
    `Could not decompress using the ${compressAdapters[algo].title} algorithm`,
  reason: 'COMPRESS',
});

const compress = function ({ algo = DEFAULT_ALGO, content }) {
  return compressAdapters[algo].compress({ content });
};

const eCompress = addGenErrorHandler(compress, {
  message: ({ algo }) =>
    `Could not compress using the ${compressAdapters[algo].title} algorithm`,
  reason: 'COMPRESS',
});

module.exports = {
  decompress: eDecompress,
  compress: eCompress,
};
