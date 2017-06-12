'use strict';


const { applyDataAliases } = require('./data');
const { applyOrderByAliases } = require('./order_by');


// Apply `alias` in server input
const applyInputAliases = function ({ args, sysArgs, modelAliases }) {
  for (const [attrName, aliases] of Object.entries(modelAliases)) {
    applyInputAlias({ args, sysArgs, attrName, aliases });
  }
};

const applyInputAlias = function ({
  args = {},
  sysArgs: { current } = {},
  attrName,
  aliases,
}) {
  if (args.data) {
    const data = args.data;
    args.data = applyDataAliases({ data, current, attrName, aliases });
  }

  if (args.order_by) {
    const orderBy = args.order_by;
    args.order_by = applyOrderByAliases({ orderBy, attrName, aliases });
  }
};


module.exports = {
  applyInputAliases,
};
