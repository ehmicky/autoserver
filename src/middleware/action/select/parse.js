'use strict';

const { throwError } = require('../../../error');
const { uniq } = require('../../../utilities');
const { addToActions } = require('../add_actions');

const { addParentSelects } = require('./parent');

// Parse `args.select` for each action
const parseSelect = function ({ actions, top }) {
  const actionsA = addToActions({
    actions,
    name: 'select',
    filter: ['select'],
    mapper: getSelectArg,
    top,
  });

  return { actions: actionsA };
};

const getSelectArg = function ({ action: { args: { select }, commandpath } }) {
  const selects = select.split(',');
  const selectsA = uniq(selects);
  const selectsB = addParentSelects({ selects: selectsA });
  const selectsC = selectsB
    .map(selectA => getSelectPart({ select: selectA, commandpath }));
  const selectsD = uniq(selectsC);
  return selectsD;
};

// Turns `args.select` 'aaa.bbb.ccc' into: { 'aaa.bbb': 'ccc' }
const getSelectPart = function ({ select, commandpath }) {
  const parts = select.split('.');
  const key = parts[parts.length - 1];
  const commandpathA = parts.slice(0, -1);
  const commandpathB = [...commandpath, ...commandpathA].join('.');

  if (commandpathB && key) {
    return { [commandpathB]: key };
  }

  const message = `In 'select' argument, '${select}' is invalid`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parseSelect,
};
