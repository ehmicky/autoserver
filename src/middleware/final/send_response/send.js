'use strict';

const { isObject } = require('../../../utilities');
const { getReason } = require('../../../error');
const { DEFAULT_FORMAT } = require('../../../formats');

const { getContentType } = require('./types');
const { serializeContent } = require('./serialize');
const { compressContent } = require('./compress');

// Set basic payload headers, then delegate to protocol handler
const send = async function ({
  protocolAdapter,
  specific,
  content,
  response,
  type,
  format,
  compressResponse,
  rpc,
  topargs,
  error,
}) {
  const formatA = normalizeFormat({ format });

  const contentType = getContentType({ format: formatA, type });

  const contentA = serializeContent({
    format: formatA,
    content,
    type,
    topargs,
    error,
  });

  const {
    content: contentB,
    compressResponse: compressResponseA,
  } = await compressContent({
    content: contentA,
    compressResponse,
    contentType,
  });

  const reason = getReason({ error });

  return protocolAdapter.send({
    specific,
    content: contentB,
    response,
    type,
    contentType,
    compressResponse: compressResponseA,
    reason,
    rpc,
  });
};

// If `raw` format was used in input, JSON should be used in output
// Also if a wrong format was parsed during protocolInput and added to mInput,
// then an error will be thrown later, but wrong `format` will be used here.
const normalizeFormat = function ({ format }) {
  const hasStructuredFormat = isObject(format) && !format.isRaw;

  if (!hasStructuredFormat) {
    return DEFAULT_FORMAT;
  }

  return format;
};

module.exports = {
  send,
};
