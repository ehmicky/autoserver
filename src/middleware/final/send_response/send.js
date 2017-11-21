'use strict';

const { getReason } = require('../../../error');
const { DEFAULT_FORMAT } = require('../../../formats');

const { getMime, types } = require('./types');
const { serializeContent } = require('./serialize');
const { compressContent } = require('./compress');

// Set basic payload headers, then delegate to protocol handler
const send = async function ({
  protocolHandler,
  specific,
  content,
  response,
  type,
  format = DEFAULT_FORMAT,
  compressResponse,
  topargs,
  error,
}) {
  // If `raw` format was used in input, default format should be used in output
  const formatA = format.name === undefined ? DEFAULT_FORMAT : format;

  const mime = getMime({ format: formatA, type });

  const contentA = serializeContent({
    format: formatA,
    content,
    type,
    topargs,
    error,
  });

  const { content: contentB, compressName } = await compressContent({
    content: contentA,
    type,
    compressResponse,
    mime,
  });

  const reason = getReason({ error });

  return protocolHandler.send({
    specific,
    content: contentB,
    response,
    type,
    mime,
    compressResponse: compressName,
    reason,
  });
};

module.exports = {
  send,
  types,
};
