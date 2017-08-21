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
const renameAliases = async function (nextFunc, input) {
  const { modelName, idl: { shortcuts: { aliasesMap } } } = input;

  const modelAliases = aliasesMap[modelName];
  const inputA = applyInputAliases({ input, modelAliases });

  const inputB = await nextFunc(inputA);

  const inputC = applyOutputAliases({ input: inputB, modelAliases });

  return inputC;
};

module.exports = {
  renameAliases,
};
