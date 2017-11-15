'use strict';

const { defaultFormat, defaultCharset } = require('../../../formats');

const { getMime, types } = require('./types');
const { serializeContent } = require('./serialize');

// Set basic payload headers, then delegate to protocol handler
const send = function ({
  protocolHandler,
  specific,
  content,
  type,
  format = defaultFormat,
  charset = defaultCharset,
  topargs,
  error,
  protocolstatus,
}) {
  // If `raw` format was used in input, default format should be used in output
  const formatA = format.name === undefined ? defaultFormat : format;

  const mime = getMime({ format: formatA, charset, type });

  const { content: contentA, contentLength } = serializeContent({
    format: formatA,
    content,
    topargs,
    charset,
    error,
  });

  return protocolHandler.send({
    specific,
    content: contentA,
    contentLength,
    mime,
    protocolstatus,
  });
};

module.exports = {
  send,
  types,
};
