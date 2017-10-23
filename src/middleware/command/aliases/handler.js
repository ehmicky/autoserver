'use strict';

const { applyInputAliases } = require('./input');
const { applyOutputAliases } = require('./output');

// Rename attributes using schema property `alias`.
// Aliases allow clients to use different possible names for the same attribute:
//   - in input, i.e. `args.data`, `args.filter|id`, `args.orderBy`
//   - in output, i.e. response will include all aliases, each with identical
//     value
// The server is unaware of aliases, i.e. only the main attribute name:
//   - is stored in the database
//   - should be used in schema functions (with `$$`)
const renameAliasesInput = function ({ modelName, schema, args }) {
  const modelAliases = getModelAliases({ modelName, schema });
  return applyInputAliases({ args, modelAliases });
};

const renameAliasesOutput = function ({ modelName, schema, response }) {
  const modelAliases = getModelAliases({ modelName, schema });
  return applyOutputAliases({ response, modelAliases });
};

const getModelAliases = function ({
  modelName,
  schema: { shortcuts: { aliasesMap } },
}) {
  return aliasesMap[modelName];
};

module.exports = {
  renameAliasesInput,
  renameAliasesOutput,
};
