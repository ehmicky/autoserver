'use strict';

const { parseArgs } = require('./args');
const { applyDirectives } = require('./directive');
const { parseSelects } = require('./select');

const parseOperation = function ({ mainDef, variables, fragments }) {
  const mainSelection = getMainSelection({ mainDef });

  const { name: { value: action }, selectionSet } = mainSelection;
  const select = parseSelects({ selectionSet, fragments });
  const args = parseArgs({ mainSelection, variables });

  return { action, args, select };
};

const getMainSelection = function ({
  mainDef: { selectionSet: { selections } },
}) {
  const [mainSelection] = selections.filter(applyDirectives);
  return mainSelection;
};

module.exports = {
  parseOperation,
};
