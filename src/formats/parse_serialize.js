'use strict';

const { formatHandlers } = require('./merger');
const { jsonCompatParse, jsonCompatSerialize } = require('./compat');

// Generic parser, delegating to the format specified in `format`
const genericParse = function ({ format, content, path }) {
  const { parse, jsonCompat } = formatHandlers[format];
  const contentA = parse({ content, path });
  const contentC = jsonCompat.reduce(
    (contentB, compatType) => jsonCompatParse[compatType](contentB),
    contentA,
  );
  return contentC;
};

// Generic serializer, delegating to the format specified in `format`
const genericSerialize = function ({ format, content }) {
  const { serialize, jsonCompat } = formatHandlers[format];
  const contentB = jsonCompat.reduce(
    (contentA, compatType) => jsonCompatSerialize[compatType](contentA),
    content,
  );
  const contentC = serialize({ content: contentB });
  return contentC;
};

let aa = {
  a: '1',
  b: 1,
  c: null,
  d: undefined,
  e: 1.5,
  f: true,
  g: [],
  h: [null],
  i: [1, 2],
  j: {
    k: true,
  },
};
aa = {
  "maxpagesize": 10,
  "protocols": {
    "http": {
      "hostname": "myhostname"
    }
  },
  "filter": {
    "payload": ["id", "old_id"]
  }
}

console.log(aa);
const bb = genericSerialize({ format: 'urlencoded', content: aa });
console.log(bb);
const cc = genericParse({ format: 'urlencoded', content: bb });
console.log(cc);

module.exports = {
  parse: genericParse,
  serialize: genericSerialize,
};
