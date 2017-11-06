'use strict';

// eslint-disable-next-line import/no-internal-modules
const { decode, encode } = require('../pagination/encoding');

const { applyOrderbyAliases } = require('./orderby');

// Copy same aliasing as `args.filter|id` and `args.orderby` but inside
// pagination tokens
const applyTokenAliases = function ({ token, attrName, aliases }) {
  try {
    const tokenObj = decode({ token });
    const tokenObjA = aliasOrderby({ token: tokenObj, attrName, aliases });
    return encode({ token: tokenObjA });
  // If this fails, this means token has an invalid format, which will be
  // reported by pagination layer
  } catch (error) { return token; }
};

const aliasOrderby = function ({
  token,
  token: { orderby },
  attrName,
  aliases,
}) {
  if (!orderby) { return token; }

  const orderbyA = applyOrderbyAliases({ orderby, attrName, aliases });
  return { ...token, orderby: orderbyA };
};

module.exports = {
  applyTokenAliases,
};
