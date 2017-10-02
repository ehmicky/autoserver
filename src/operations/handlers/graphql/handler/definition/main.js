'use strict';

const { throwError } = require('../../../../../error');

const { parseArgs } = require('./args');
const { applyDirectives } = require('./directive');
const { parseSelects } = require('./select');

const parseOperationDef = function ({ mainDef, variables, fragments }) {
  const mainSelection = getMainSelection({ mainDef });

  const { name: { value: commandName } } = mainSelection;
  const argsA = getArgs({ mainSelection, variables, fragments });

  return { commandName, args: argsA };
};

const getMainSelection = function ({
  mainDef: { selectionSet: { selections } },
}) {
  const [mainSelection] = selections.filter(applyDirectives);
  return mainSelection;
};

const getArgs = function ({
  mainSelection,
  mainSelection: { selectionSet },
  variables,
  fragments,
}) {
  const select = parseSelects({ selectionSet, fragments });
  const args = parseArgs({ mainSelection, variables });

  if (args.select !== undefined) {
    const message = 'Cannot specify \'select\' argument with GraphQL';
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return { ...args, select };
};

module.exports = {
  parseOperationDef,
};
