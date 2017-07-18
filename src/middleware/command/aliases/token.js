'use strict';

// eslint-disable-next-line import/no-internal-modules
const { decode, encode } = require('../pagination/encoding');

const { applyOrderByAliases } = require('./order_by');

// Copy same aliasing as `args.nFilter` and `args.nOrderBy` but inside
// pagination tokens
const applyTokenAliases = function ({ token, attrName, aliases }) {
  try {
    const tokenObj = decode({ token });

    const { nOrderBy } = tokenObj;

    if (nOrderBy) {
      tokenObj.nOrderBy = applyOrderByAliases({ nOrderBy, attrName, aliases });
    }

    token = encode({ token: tokenObj });
    return token;
  // If this fails, this means token has an invalid format, which will be
  // reported by pagination layer
  } catch (error) { return token; }
};

module.exports = {
  applyTokenAliases,
};
