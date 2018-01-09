'use strict';

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

// Generic serializer, delegating to the format specified in `format`
const serializeContent = function ({ serialize, jsonCompat }, content) {
  const contentA = applyCompatSerialize({ jsonCompat, content });
  const contentB = serialize({ content: contentA });
  return contentB;
};

module.exports = {
  parseContent,
  serializeContent,
};
