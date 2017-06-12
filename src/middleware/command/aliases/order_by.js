'use strict';


// Copy first defined alias to main attribute, providing it is not defined.
const applyOrderByAliases = function ({ orderBy, attrName, aliases }) {
  if (!(orderBy instanceof Array)) { return orderBy; }

  orderBy = orderBy.map(orderPart => {
    if (!orderPart || orderPart.constructor !== Object) { return orderPart; }
    if (!aliases.includes(orderPart.attrName)) { return orderPart; }
    orderPart.attrName = attrName;
    return orderPart;
  });

  return orderBy;
};


module.exports = {
  applyOrderByAliases,
};
