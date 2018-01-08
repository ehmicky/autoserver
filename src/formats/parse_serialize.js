'use strict';

const { addGenErrorHandler } = require('../errors');

const { formatAdapters } = require('./merger');
const { applyCompatParse, applyCompatSerialize } = require('./compat');
const { getTitle } = require('./info');

// Generic parser, delegating to the format specified in `format`
const genericParse = function ({ format, content, path, compat = true }) {
  const { parse, jsonCompat } = formatAdapters[format];
  const contentA = parse({ content, path });

  if (!compat) { return contentA; }

  const contentB = applyCompatParse({ jsonCompat, content: contentA });
  return contentB;
};

const eParse = addGenErrorHandler(genericParse, {
  message: ({ format }) => `Could not parse ${getTitle({ format })}`,
  reason: 'FORMAT',
});

// Generic serializer, delegating to the format specified in `format`
const genericSerialize = function ({ format, content }) {
  const { serialize, jsonCompat } = formatAdapters[format];
  const contentA = applyCompatSerialize({ jsonCompat, content });
  const contentB = serialize({ content: contentA });
  return contentB;
};

const eSerialize = addGenErrorHandler(genericSerialize, {
  message: ({ format }) => `Could not serialize ${getTitle({ format })}`,
  reason: 'FORMAT',
});

module.exports = {
  parse: eParse,
  serialize: eSerialize,
};
