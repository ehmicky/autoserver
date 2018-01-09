'use strict';

const { shouldCompress, DEFAULT_ALGO } = require('../../../compress');

const { TYPES } = require('./types');

// Response body compression
const compressContent = async function ({
  content,
  compressResponse,
  type,
  contentType,
}) {
  const algo = getAlgo({ compressResponse, type, contentType });

  const contentA = await algo.compress(content);

  return { content: contentA, compressResponse: algo };
};

const getAlgo = function ({ compressResponse, type, contentType }) {
  const isInvalid = compressResponse === undefined ||
    typeof compressResponse === 'string' ||
    !willCompress({ type, contentType });
  if (isInvalid) { return DEFAULT_ALGO; }

  return compressResponse;
};

const willCompress = function ({ type, contentType }) {
  return TYPES[type].isText || shouldCompress({ contentType });
};

module.exports = {
  compressContent,
};
