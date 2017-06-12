'use strict';


const { applyDataAliases } = require('./data');
const { applyOrderByAliases } = require('./order_by');
const { applyTokenAliases } = require('./token');


// Apply `alias` in server input
const applyInputAliases = function ({ args, sysArgs, modelAliases }) {
  for (const [attrName, aliases] of Object.entries(modelAliases)) {
    applyInputAlias({ args, sysArgs, attrName, aliases });
  }
};

const applyInputAlias = function ({
  args = {},
  sysArgs: { currentData } = {},
  attrName,
  aliases,
}) {
  if (args.data) {
    const data = args.data;
    args.data = applyDataAliases({ data, currentData, attrName, aliases });
  }

  if (args.order_by) {
    const orderBy = args.order_by;
    args.order_by = applyOrderByAliases({ orderBy, attrName, aliases });
  }

  if (args.after !== undefined && args.after !== '') {
    const token = args.after;
    args.after = applyTokenAliases({ token, attrName, aliases });
  }

  if (args.before !== undefined && args.before !== '') {
    const token = args.before;
    args.before = applyTokenAliases({ token, attrName, aliases });
  }
};


module.exports = {
  applyInputAliases,
};
