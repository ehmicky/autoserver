'use strict';

const { validateSameType, parseAsIs } = require('./common');

// `{ attribute: { lt: value } }`
const evalLt = function ({ attr, value }) {
  return attr < value;
};

// `{ attribute: { gt: value } }`
const evalGt = function ({ attr, value }) {
  return attr > value;
};

// `{ attribute: { lte: value } }`
const evalLte = function ({ attr, value }) {
  return attr <= value;
};

// `{ attribute: { gte: value } }`
const evalGte = function ({ attr, value }) {
  return attr >= value;
};

module.exports = {
  lt: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalLt,
  },
  gt: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalGt,
  },
  lte: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalLte,
  },
  gte: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalGte,
  },
};
