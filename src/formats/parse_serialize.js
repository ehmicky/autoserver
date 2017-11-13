'use strict';

const formats = require('./merger');
const { jsonCompatParse, jsonCompatSerialize } = require('./compat');

// Generic parser, delegating to the format specified in `format`
const genericParse = function ({ format, content, path }) {
  const { parse, jsonCompat } = formats[format];
  const contentA = parse({ content, path });
  return jsonCompat.reduce(
    (contentB, compatType) => jsonCompatParse[compatType](contentB),
    contentA,
  );
};

// Generic serializer, delegating to the format specified in `format`
const genericSerialize = function ({ format, content }) {
  const { serialize, jsonCompat } = formats[format];
  const contentB = jsonCompat.reduce(
    (contentA, compatType) => jsonCompatSerialize[compatType](contentA),
    content,
  );
  const contentC = serialize({ content: contentB });
  return contentC;
};

module.exports = {
  parse: genericParse,
  serialize: genericSerialize,
};
