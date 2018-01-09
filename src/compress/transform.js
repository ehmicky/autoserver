'use strict';

const { addGenErrorHandler } = require('../errors');

// Generic compression/decompression
// Input and output is buffer
const decompress = function (compressAdapter, content) {
  return compressAdapter.decompress({ content });
};

const eDecompress = addGenErrorHandler(decompress, { reason: 'COMPRESS' });

const compress = function (compressAdapter, content) {
  return compressAdapter.compress({ content });
};

const eCompress = addGenErrorHandler(compress, { reason: 'COMPRESS' });

module.exports = {
  decompress: eDecompress,
  compress: eCompress,
};
