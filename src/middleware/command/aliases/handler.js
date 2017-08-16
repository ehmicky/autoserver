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
//   - should be used in JSL (with `$$`) in IDL file
const renameAliases = async function (nextFunc, input) {
  const { modelName, idl: { shortcuts: { aliasesMap } } } = input;

  const modelAliases = aliasesMap[modelName];
  const inputA = applyInputAliases({ input, modelAliases });

  const response = await nextFunc(inputA);

  const responseA = applyOutputAliases({ response, modelAliases });

  return responseA;
};

module.exports = {
  renameAliases,
};
