'use strict';

const { throwError } = require('../../../../../error');

const { parseArgs } = require('./args');
const { applyDirectives } = require('./directive');
const { parseSelects } = require('./select');
const { addPopulate } = require('./populate');

// Transform GraphQL AST into rpc-agnostic `rpcDef`
const parseRpcDef = function ({ mainDef, variables, fragments }) {
  const mainSelection = getMainSelection({ mainDef, variables });

  const { name: { value: commandName } } = mainSelection;
  const argsA = getArgs({ mainSelection, variables, fragments, commandName });

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
  commandName,
}) {
  const args = parseArgs({ mainSelection, variables });

  FORBIDDEN_ARGS.forEach(argName => validateForbiddenArg({ args, argName }));

  const argsA = parseSelects({ args, selectionSet, variables, fragments });
  const argsB = addPopulate({ args: argsA, commandName });

  return argsB;
};

const FORBIDDEN_ARGS = ['select', 'populate'];

const validateForbiddenArg = function ({ args, argName }) {
  if (args[argName] === undefined) { return; }

  const message = `Cannot specify '${argName}' argument with GraphQL`;
  throwError(message, { reason: 'SYNTAX_VALIDATION' });
};

module.exports = {
  parseRpcDef,
};
