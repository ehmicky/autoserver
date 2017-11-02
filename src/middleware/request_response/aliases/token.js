'use strict';

// eslint-disable-next-line import/no-internal-modules
const { decode, encode } = require('../pagination/encoding');

const { applyOrderByAliases } = require('./order_by');

// Copy same aliasing as `args.filter|id` and `args.orderBy` but inside
// pagination tokens
const applyTokenAliases = function ({ token, attrName, aliases }) {
  try {
    const tokenObj = decode({ token });
    const tokenObjA = aliasOrderBy({ token: tokenObj, attrName, aliases });
    return encode({ token: tokenObjA });
  // If this fails, this means token has an invalid format, which will be
  // reported by pagination layer
  } catch (error) { return token; }
};

const aliasOrderBy = function ({
  token,
  token: { orderBy },
  attrName,
  aliases,
}) {
  if (!orderBy) { return token; }

  const orderByA = applyOrderByAliases({ orderBy, attrName, aliases });
  return { ...token, orderBy: orderByA };
};

module.exports = {
  applyTokenAliases,
};
