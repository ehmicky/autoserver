'use strict';


const { decode, encode } = require('../../api/pagination/encoding');
const { applyOrderByAliases } = require('./order_by');


// Copy same aliasing as `args.filter` and `args.order_by` but inside
// pagination tokens
const applyTokenAliases = function ({ token, attrName, aliases }) {
  try {
    const tokenObj = decode({ token });

    const { orderBy } = tokenObj;
    if (orderBy) {
      tokenObj.orderBy = applyOrderByAliases({ orderBy, attrName, aliases });
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
