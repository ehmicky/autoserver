'use strict';

const { validateSameType, parseAsIs } = require('./common');

// `{ attribute: { _lt: value } }`
const evalLt = function ({ attr, value }) {
  return attr < value;
};

// `{ attribute: { _gt: value } }`
const evalGt = function ({ attr, value }) {
  return attr > value;
};

// `{ attribute: { _lte: value } }`
const evalLte = function ({ attr, value }) {
  return attr <= value;
};

// `{ attribute: { _gte: value } }`
const evalGte = function ({ attr, value }) {
  return attr >= value;
};

module.exports = {
  _lt: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalLt,
  },
  _gt: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalGt,
  },
  _lte: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalLte,
  },
  _gte: {
    parse: parseAsIs,
    validate: validateSameType,
    eval: evalGte,
  },
};
