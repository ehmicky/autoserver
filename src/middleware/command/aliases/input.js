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

  for (const direction of ['after', 'before']) {
    const token = args[direction];

    if (token !== undefined && token !== '') {
      args[direction] = applyTokenAliases({ token, attrName, aliases });
    }
  }
};

module.exports = {
  applyInputAliases,
};
