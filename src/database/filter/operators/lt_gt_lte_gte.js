'use strict';

// `{ attribute: { gt: value } }`
const evalGt = function ({ attr, value }) {
  return attr > value;
};

// `{ attribute: { gte: value } }`
const evalGte = function ({ attr, value }) {
  return attr >= value;
};

// `{ attribute: { lt: value } }`
const evalLt = function ({ attr, value }) {
  return attr < value;
};

// `{ attribute: { lte: value } }`
const evalLte = function ({ attr, value }) {
  return attr <= value;
};

module.exports = {
  evalGt,
  evalGte,
  evalLt,
  evalLte,
};
