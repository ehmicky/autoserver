'use strict';

const { addGenErrorHandler } = require('../errors');

const { applyCompatParse, applyCompatSerialize } = require('./compat');

// Generic parser, delegating to the format specified in `format`
const parseContent = function (
  { parse, jsonCompat },
  content,
  { path, compat = true } = {},
) {
  const contentA = parse({ content, path });

  if (!compat) { return contentA; }

  const contentB = applyCompatParse({ jsonCompat, content: contentA });
  return contentB;
};

const eParseContent = addGenErrorHandler(parseContent, {
  reason: 'FORMAT',
});

// Generic serializer, delegating to the format specified in `format`
const serializeContent = function ({ serialize, jsonCompat }, content) {
  const contentA = applyCompatSerialize({ jsonCompat, content });
  const contentB = serialize({ content: contentA });
  return contentB;
};

const eSerializeContent = addGenErrorHandler(serializeContent, {
  reason: 'FORMAT',
});

module.exports = {
  parseContent: eParseContent,
  serializeContent: eSerializeContent,
};
