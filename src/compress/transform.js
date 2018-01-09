'use strict';

// Generic compression/decompression
// Input and output is buffer
const decompress = function (compressAdapter, content) {
  return compressAdapter.decompress({ content });
};

const compress = function (compressAdapter, content) {
  return compressAdapter.compress({ content });
};

module.exports = {
  decompress,
  compress,
};
