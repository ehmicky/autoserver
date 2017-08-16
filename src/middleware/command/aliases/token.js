'use strict';

// eslint-disable-next-line import/no-internal-modules
const { decode, encode } = require('../pagination/encoding');

const { applyOrderByAliases } = require('./order_by');

// Copy same aliasing as `args.filter` and `args.nOrderBy` but inside
// pagination tokens
const applyTokenAliases = function ({ token, attrName, aliases }) {
  try {
    const tokenObj = decode({ token });
    const tokenObjA = aliasNOrderBy({ token: tokenObj, attrName, aliases });
    return encode({ token: tokenObjA });
  // If this fails, this means token has an invalid format, which will be
  // reported by pagination layer
  } catch (error) { return token; }
};

const aliasNOrderBy = function ({
  token,
  token: { nOrderBy },
  attrName,
  aliases,
}) {
  if (!nOrderBy) { return token; }

  const nOrderByA = applyOrderByAliases({ nOrderBy, attrName, aliases });
  return { ...token, nOrderBy: nOrderByA };
};

module.exports = {
  applyTokenAliases,
};
