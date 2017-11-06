'use strict';

// Copy first defined alias to main attribute, providing it is not defined.
const applyOrderbyAliases = function ({ orderby, attrName, aliases }) {
  if (!Array.isArray(orderby)) { return orderby; }

  return orderby.map(orderPart => {
    if (!orderPart || orderPart.constructor !== Object) { return orderPart; }
    if (!aliases.includes(orderPart.attrName)) { return orderPart; }
    return { ...orderPart, attrName };
  });
};

module.exports = {
  applyOrderbyAliases,
};
