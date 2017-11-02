'use strict';

// Copy first defined alias to main attribute, providing it is not defined.
const applyOrderByAliases = function ({ orderBy, attrName, aliases }) {
  if (!Array.isArray(orderBy)) { return orderBy; }

  return orderBy.map(orderPart => {
    if (!orderPart || orderPart.constructor !== Object) { return orderPart; }
    if (!aliases.includes(orderPart.attrName)) { return orderPart; }
    return { ...orderPart, attrName };
  });
};

module.exports = {
  applyOrderByAliases,
};
