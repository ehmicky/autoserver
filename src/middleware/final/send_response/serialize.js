'use strict';

const { serialize } = require('../../../formats');

const serializeContent = function ({ format, content, topargs, error }) {
  const contentA = stringifyContent({ format, content });

  const contentB = applySilent({ content: contentA, topargs, error });

  return contentB;
};

const stringifyContent = function ({ format: { name }, content }) {
  if (typeof content === 'string') { return content; }

  const contentA = serialize({ format: name, content });
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
