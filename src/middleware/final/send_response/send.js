'use strict';

const { serialize } = require('../../../formats');

const { getMime, types } = require('./types');

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
  const format = 'json';

  const mime = getMime({ format, type });

  const { content: contentA, contentLength } = serializeContent({
    format,
    content,
    topargs,
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

const serializeContent = function ({ format, content, topargs, error }) {
  const contentA = stringifyContent({ format, content });

  // Calculated before `args.silent` is applied
  // This is in accordance to how HEAD is supposed to work in HTTP spec
  const contentLength = Buffer.byteLength(contentA);

  const contentB = applySilent({ content: contentA, topargs, error });

  return { content: contentB, contentLength };
};

const stringifyContent = function ({ format, content }) {
  if (typeof content === 'string') { return content; }

  const contentA = serialize({ format, content });
  return contentA;
};

// When `args.silent` is used (unless this is an error response).
const applySilent = function ({ content, topargs: { silent } = {}, error }) {
  if (silent && error === undefined) { return ''; }

  return content;
};

module.exports = {
  send,
  types,
};
