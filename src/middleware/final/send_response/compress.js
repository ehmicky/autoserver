'use strict';

const { compress, shouldCompress, DEFAULT_ALGO } = require('../../../compress');

// Response body compression
const compressContent = async function ({
  content,
  compressResponse,
  contentType,
}) {
  const algo = getAlgo({ compressResponse, contentType });

  const contentA = await compress({ algo, content, contentType });

  return { content: contentA, compressResponse: algo };
};

const getAlgo = function ({ compressResponse, contentType }) {
  if (!shouldCompress({ contentType })) { return DEFAULT_ALGO; }

  return compressResponse;
};

module.exports = {
  compressContent,
};
