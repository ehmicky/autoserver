'use strict';

const { groupBy, uniq, omit, assignArray } = require('../../../utilities');

const { addParentSelects } = require('./parent');
const { validateSelectPart, validateSelects } = require('./validate');

// Parse `args.select` for each action
const parseSelect = function ({ actions, top }) {
  const selects = actions
    .filter(({ args: { select } }) => select !== undefined)
    .map(parseSelectArg)
    .reduce(assignArray, []);

  const actionsA = addSelects({ actions, selects, top });

  return { actions: actionsA };
};

const parseSelectArg = function ({ args: { select }, commandpath }) {
  const selects = select.split(',');
  const selectsA = uniq(selects);
  const selectsB = addParentSelects({ selects: selectsA });
  const selectsC = selectsB
    .map(selectA => parseSelectPart({ select: selectA, commandpath }));
  return selectsC;
};

// Turns `args.select` 'aaa.bbb.ccc=ddd' into:
// `commandpath` 'aaa.bbb', `key` 'ccc', `outputName` 'ddd']
const parseSelectPart = function ({ select, commandpath }) {
  const selectA = [...commandpath, select].join('.');
  const [, commandpathA, key, , outputName] = SELECT_REGEXP.exec(selectA) || [];

  validateSelectPart({ select, commandpath: commandpathA, key });

  return { commandpath: commandpathA, key, outputName };
};

const SELECT_REGEXP = /^([^=]*)\.([^.=]+)(=(.+))?$/;

// Add `args.select` to each action
const addSelects = function ({ actions, selects, top }) {
  const selectsMap = groupBy(selects, 'commandpath');
  const actionsA = actions.map(action => addSelect({ action, selectsMap }));

  validateSelects({ actions, selects, top });

  return actionsA;
};

const addSelect = function ({ action, action: { args }, selectsMap }) {
  const select = getSelect({ selectsMap, action });
  return { ...action, args: { ...args, select } };
};

const getSelect = function ({ selectsMap, action: { commandpath } }) {
  const selects = selectsMap[commandpath.join('.')];

  // Unless `args.select` is specified, no selection is performed
  if (selects === undefined) {
    return [{ key: 'all' }];
  }

  const select = selects.map(selectA => omit(selectA, 'commandpath'));
  return select;
};

module.exports = {
  parseSelect,
};
