'use strict';

// Copy first defined alias to main attribute, providing it is not defined.
const applyOrderByAliases = function ({ nOrderBy, attrName, aliases }) {
  if (!Array.isArray(nOrderBy)) { return nOrderBy; }

  nOrderBy = nOrderBy.map(orderPart => {
    if (!orderPart || orderPart.constructor !== Object) { return orderPart; }
    if (!aliases.includes(orderPart.attrName)) { return orderPart; }
    orderPart.attrName = attrName;
    return orderPart;
  });

  return nOrderBy;
};

module.exports = {
  applyOrderByAliases,
};
