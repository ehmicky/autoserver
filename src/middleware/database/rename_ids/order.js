'use strict';

// Modify `args.order`
const renameOrder = function ({ value, newIdName, oldIdName }) {
  return value.map(part => renameOrderPart({ part, newIdName, oldIdName }));
};

const renameOrderPart = function ({
  part,
  part: { attrName },
  newIdName,
  oldIdName,
}) {
  if (attrName !== oldIdName) { return part; }

  return { ...part, attrName: newIdName };
};

module.exports = {
  renameOrder,
};
