'use strict';


const { getAliasesMap } = require('./map');
const { applyInputAliases } = require('./input');
const { applyOutputAliases } = require('./output');


/**
 * Rename attributes using IDL `alias`.
 * Aliases allow clients to use different possible names for the same attribute:
 *   - in input, i.e. `args.data`, `args.filter`, `args.order_by`
 *   - in output, i.e. response will include all aliases, each with identical
 *     value
 * The server is unaware of aliases, i.e. only the main attribute name:
 *   - is stored in the database
 *   - should be used in JSL (with `$$`) in IDL file
 **/
const renameAliases = function ({ idl, startupLog }) {
  const perf = startupLog.perf.start('command.renameAliases', 'middleware');
  const aliasesMap = getAliasesMap({ idl });
  perf.stop();

  return async function renameAliases(input) {
    const { args, modelName, sysArgs, log } = input;
    const perf = log.perf.start('command.renameAliases', 'middleware');

    const modelAliases = aliasesMap[modelName];

    applyInputAliases({ args, sysArgs, modelAliases });

    perf.stop();
    const response = await this.next(input);

    applyOutputAliases({ response, modelAliases });

    return response;
  };
};


module.exports = {
  renameAliases,
};
