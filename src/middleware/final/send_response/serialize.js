'use strict';

const { encode } = require('iconv-lite');

const { addGenErrorHandler } = require('../../../error');
const { serialize } = require('../../../formats');

const serializeContent = function ({
  format,
  content,
  topargs,
  charset,
  error,
}) {
  const contentA = stringifyContent({ format, content });

  const contentB = eEncode(contentA, charset);

  // Calculated before `args.silent` is applied
  // This is in accordance to how HEAD is supposed to work in HTTP spec
  const contentLength = Buffer.byteLength(contentB);

  const contentC = applySilent({ content: contentB, topargs, error });

  return { content: contentC, contentLength };
};

const stringifyContent = function ({ format, content }) {
  if (typeof content === 'string') { return content; }

  const contentA = serialize({ format, content });
  return contentA;
};

// Charset encoding is done in a protocol-agnostic way
const eEncode = addGenErrorHandler(encode, {
  message: ({ charset }) => `The response is invalid: the charset '${charset}' could not be encoded`,
  reason: 'INPUT_SERVER_VALIDATION',
});

// When `args.silent` is used (unless this is an error response).
const applySilent = function ({ content, topargs: { silent } = {}, error }) {
  if (silent && error === undefined) { return ''; }

  return content;
};

module.exports = {
  serializeContent,
};
