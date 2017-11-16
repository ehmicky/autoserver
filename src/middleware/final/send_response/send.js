'use strict';

const { getReason } = require('../../../error');
const { defaultFormat, defaultCharset } = require('../../../formats');

const { getMime, types } = require('./types');
const { serializeContent } = require('./serialize');

// Set basic payload headers, then delegate to protocol handler
const send = function ({
  protocolHandler,
  specific,
  content,
  metadata,
  type,
  format = defaultFormat,
  charset = defaultCharset,
  topargs,
  error,
}) {
  // If `raw` format was used in input, default format should be used in output
  const formatA = format.name === undefined ? defaultFormat : format;

  const mime = getMime({ format: formatA, charset, type });

  const contentA = serializeContent({
    format: formatA,
    content,
    topargs,
    charset,
    error,
  });

  const reason = getReason({ error });

  return protocolHandler.send({
    specific,
    content: contentA,
    metadata,
    type,
    mime,
    reason,
  });
};

module.exports = {
  send,
  types,
};
