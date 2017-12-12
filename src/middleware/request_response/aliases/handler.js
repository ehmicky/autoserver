'use strict';

const { applyInputAliases } = require('./input');
const { applyOutputAliases } = require('./output');

// Rename attributes using config property `alias`.
// Aliases allow clients to use different possible names for the same attribute:
//   - in input, i.e. `args.data`, `args.filter|id`, `args.order`
//   - in output, i.e. response will include all aliases, each with identical
//     value
// The server is unaware of aliases, i.e. only the main attribute name:
//   - is stored in the database
//   - should be used in config functions (with `model`)
const renameAliasesInput = function ({ collname, config, args }) {
  const modelAliases = getModelAliases({ collname, config });
  return applyInputAliases({ args, modelAliases });
};

const renameAliasesOutput = function ({ collname, config, response }) {
  const modelAliases = getModelAliases({ collname, config });
  return applyOutputAliases({ response, modelAliases });
};

const getModelAliases = function ({
  collname,
  config: { shortcuts: { aliasesMap } },
}) {
  return aliasesMap[collname];
};

module.exports = {
  renameAliasesInput,
  renameAliasesOutput,
};
