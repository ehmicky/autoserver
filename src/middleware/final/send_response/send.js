'use strict';

const { getCharset, formatHandlers } = require('../../../formats');

const { getMime, types } = require('./types');
const { serializeContent } = require('./serialize');

// Set basic payload headers, then delegate to protocol handler
const send = function ({
  protocolHandler,
  specific,
  content,
  type,
  topargs,
  error,
  protocolstatus,
}) {
  const { format, charset } = getFormats({ topargs });

  const mime = getMime({ format, charset, type });

  const { content: contentA, contentLength } = serializeContent({
    format,
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

const getFormats = function ({ topargs: { format = 'json', charset } = {} }) {
  const formatObj = formatHandlers[format] || { title: format };
  const charsetA = getCharset({ format: formatObj, charset });

  return { format, charset: charsetA };
};

module.exports = {
  send,
  types,
};
