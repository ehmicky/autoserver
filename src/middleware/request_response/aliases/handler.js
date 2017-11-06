'use strict';

const { applyInputAliases } = require('./input');
const { applyOutputAliases } = require('./output');

// Rename attributes using schema property `alias`.
// Aliases allow clients to use different possible names for the same attribute:
//   - in input, i.e. `args.data`, `args.filter|id`, `args.orderby`
//   - in output, i.e. response will include all aliases, each with identical
//     value
// The server is unaware of aliases, i.e. only the main attribute name:
//   - is stored in the database
//   - should be used in schema functions (with `$model`)
const renameAliasesInput = function ({ modelname, schema, args }) {
  const modelAliases = getModelAliases({ modelname, schema });
  return applyInputAliases({ args, modelAliases });
};

const renameAliasesOutput = function ({ modelname, schema, response }) {
  const modelAliases = getModelAliases({ modelname, schema });
  return applyOutputAliases({ response, modelAliases });
};

const getModelAliases = function ({
  modelname,
  schema: { shortcuts: { aliasesMap } },
}) {
  return aliasesMap[modelname];
};

module.exports = {
  renameAliasesInput,
  renameAliasesOutput,
};
