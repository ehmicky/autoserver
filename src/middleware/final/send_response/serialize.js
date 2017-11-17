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

  const contentC = applySilent({ content: contentB, topargs, error });

  return contentC;
};

const stringifyContent = function ({ format: { name }, content }) {
  if (typeof content === 'string') { return content; }

  const contentA = serialize({ format: name, content });
  return contentA;
};

// Charset encoding is done in a protocol-agnostic way
const eEncode = addGenErrorHandler(encode, {
  message: ({ charset }) => `The response is invalid: the charset '${charset}' could not be encoded`,
  reason: 'SERVER_INPUT_VALIDATION',
});

// When `args.silent` is used (unless this is an error response).
const applySilent = function ({ content, topargs: { silent } = {}, error }) {
  if (silent && error === undefined) { return ''; }

  return content;
};

module.exports = {
  serializeContent,
};
