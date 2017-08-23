'use strict';

const { applyInputAliases } = require('./input');
const { applyOutputAliases } = require('./output');

// Rename attributes using IDL `alias`.
// Aliases allow clients to use different possible names for the same attribute:
//   - in input, i.e. `args.data`, `args.filter`, `args.nOrderBy`
//   - in output, i.e. response will include all aliases, each with identical
//     value
// The server is unaware of aliases, i.e. only the main attribute name:
//   - is stored in the database
//   - should be used in IDL functions (with `$$`)
const renameAliasesInput = function ({ modelName, idl, args }) {
  const modelAliases = getModelAliases({ modelName, idl });
  return applyInputAliases({ args, modelAliases });
};

const renameAliasesOutput = function ({ modelName, idl, response }) {
  const modelAliases = getModelAliases({ modelName, idl });
  return applyOutputAliases({ response, modelAliases });
};

const getModelAliases = function ({
  modelName,
  idl: { shortcuts: { aliasesMap } },
}) {
  return aliasesMap[modelName];
};

module.exports = {
  renameAliasesInput,
  renameAliasesOutput,
};
