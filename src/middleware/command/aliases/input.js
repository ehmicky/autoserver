'use strict';

const { applyDataAliases } = require('./data');
const { applyOrderByAliases } = require('./order_by');
const { applyTokenAliases } = require('./token');

// Apply `alias` in server input
const applyInputAliases = function ({ args, modelAliases }) {
  for (const [attrName, aliases] of Object.entries(modelAliases)) {
    applyInputAlias({ args, attrName, aliases });
  }
};

const applyInputAlias = function ({ args = {}, attrName, aliases }) {
  if (args.newData) {
    const { currentData, newData } = args;
    args.newData = applyDataAliases({
      newData,
      currentData,
      attrName,
      aliases,
    });
  }

  if (args.nOrderBy) {
    const { nOrderBy } = args;
    args.nOrderBy = applyOrderByAliases({ nOrderBy, attrName, aliases });
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
