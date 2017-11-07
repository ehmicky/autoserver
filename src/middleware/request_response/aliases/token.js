'use strict';

// eslint-disable-next-line import/no-internal-modules
const { decode, encode } = require('../pagination/encoding');

const { applyOrderAliases } = require('./order');

// Copy same aliasing as `args.filter|id` and `args.order` but inside
// pagination tokens
const applyTokenAliases = function ({ token, attrName, aliases }) {
  try {
    const tokenObj = decode({ token });
    const tokenObjA = aliasOrder({ token: tokenObj, attrName, aliases });
    return encode({ token: tokenObjA });
  // If this fails, this means token has an invalid format, which will be
  // reported by pagination layer
  } catch (error) { return token; }
};

const aliasOrder = function ({
  token,
  token: { order },
  attrName,
  aliases,
}) {
  if (!order) { return token; }

  const orderA = applyOrderAliases({ order, attrName, aliases });
  return { ...token, order: orderA };
};

module.exports = {
  applyTokenAliases,
};
