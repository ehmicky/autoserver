'use strict';

const { formatAdapters } = require('./merger');
const { applyCompatParse, applyCompatSerialize } = require('./compat');

// Generic parser, delegating to the format specified in `format`
const genericParse = function ({ format, content, path, compat = true }) {
  const { parse, jsonCompat } = formatAdapters[format];
  const contentA = parse({ content, path });

  if (!compat) { return contentA; }

  const contentB = applyCompatParse({ jsonCompat, content: contentA });
  return contentB;
};

// Generic serializer, delegating to the format specified in `format`
const genericSerialize = function ({ format, content }) {
  const { serialize, jsonCompat } = formatAdapters[format];
  const contentA = applyCompatSerialize({ jsonCompat, content });
  const contentB = serialize({ content: contentA });
  return contentB;
};

module.exports = {
  parse: genericParse,
  serialize: genericSerialize,
};
