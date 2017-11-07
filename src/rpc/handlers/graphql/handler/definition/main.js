'use strict';

const { throwError } = require('../../../../../error');

const { parseArgs } = require('./args');
const { applyDirectives } = require('./directive');
const { parseSelects } = require('./select');

// Transform GraphQL AST into rpc-agnostic `rpcDef`
const parseRpcDef = function ({ mainDef, variables, fragments }) {
  const mainSelection = getMainSelection({ mainDef, variables });

  const { name: { value: commandName } } = mainSelection;
  const argsA = getArgs({ mainSelection, variables, fragments });

  return { commandName, args: argsA };
};

const getMainSelection = function ({
  mainDef: { selectionSet: { selections } },
  variables,
}) {
  const [mainSelection] = selections
    .filter(selection => applyDirectives({ selection, variables }));
  return mainSelection;
};

const getArgs = function ({
  mainSelection,
  mainSelection: { selectionSet },
  variables,
  fragments,
}) {
  const select = parseSelects({ selectionSet, variables, fragments });
  const args = parseArgs({ mainSelection, variables });

  if (args.select !== undefined) {
    const message = 'Cannot specify \'select\' argument with GraphQL';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return { ...args, select };
};

module.exports = {
  parseRpcDef,
};
