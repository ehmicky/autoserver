'use strict';

const { Buffer } = require('buffer');

const { serialize } = require('../../../formats');
const { isType } = require('../../../content_types');

const serializeContent = function ({ format, content, type, topargs, error }) {
  const contentA = stringifyContent({ format, content, type });

  const contentB = applySilent({ content: contentA, topargs, error });

  const contentC = Buffer.from(contentB);

  return contentC;
};

const stringifyContent = function ({ format, content, type }) {
  if (!isType(type, 'object')) { return content; }

  const contentA = serialize({ format, content });
  return contentA;
};

// When `args.silent` is used (unless this is an error response).
const applySilent = function ({ content, topargs: { silent } = {}, error }) {
  if (silent && error === undefined) { return ''; }

  return content;
};

module.exports = {
  serializeContent,
};
