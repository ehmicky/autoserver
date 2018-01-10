'use strict';

const { getReason } = require('../../../errors');
const { DEFAULT_FORMAT, DEFAULT_RAW_FORMAT } = require('../../../formats');

const { getContentType } = require('./types');
const { serializeContent } = require('./serialize');
const { compressContent } = require('./compress');

// Set basic payload headers, then delegate to protocol handler
const send = async function ({
  protocolAdapter,
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
    type,
    contentType,
  });

  const reason = getReason({ error });

  return protocolAdapter.send({
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
  const isInvalidFormat = format === undefined ||
    typeof format === 'string' ||
    format.name === DEFAULT_RAW_FORMAT.name;
  if (!isInvalidFormat) { return format; }

  return DEFAULT_FORMAT;
};

module.exports = {
  send,
};
