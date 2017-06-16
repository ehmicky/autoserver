'use strict';


const { applyInputAliases } = require('./input');
const { applyOutputAliases } = require('./output');


/**
 * Rename attributes using IDL `alias`.
 * Aliases allow clients to use different possible names for the same attribute:
 *   - in input, i.e. `args.data`, `args.nFilter`, `args.nOrderBy`
 *   - in output, i.e. response will include all aliases, each with identical
 *     value
 * The server is unaware of aliases, i.e. only the main attribute name:
 *   - is stored in the database
 *   - should be used in JSL (with `$$`) in IDL file
 **/
const renameAliases = function () {
  return async function renameAliases(input) {
    const { args, modelName, log, idl: { shortcuts: { aliasesMap } } } = input;
    const perf = log.perf.start('command.renameAliases', 'middleware');

    const modelAliases = aliasesMap[modelName];

    applyInputAliases({ args, modelAliases });

    perf.stop();
    const response = await this.next(input);

    applyOutputAliases({ response, modelAliases });

    return response;
  };
};


module.exports = {
  renameAliases,
};
