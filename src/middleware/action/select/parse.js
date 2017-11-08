'use strict';

const { groupValuesBy, omit, uniq } = require('../../../utilities');
const { throwError } = require('../../../error');
const { getModel } = require('../get_model');
const { addActions } = require('../add_actions');

const { validateSelectPart, validateSelect } = require('./validate');
const { addParentSelects } = require('./parent');

// Turn `args.select` into a set of `actions`
const parseSelect = function ({ actions, ...rest }) {
  const actionsA = addActions({
    actions,
    filter: ({ args: { select }, commandpath }) =>
      select !== undefined || commandpath.length <= 1,
    mapper: getSelectAction,
    ...rest,
  });

  validateSelect({ actions: actionsA, ...rest });

  return { actions: actionsA };
};

const getSelectAction = function ({
  action: { args: { select = '' } },
  top,
  schema,
}) {
  const selects = select.split(',');
  const selectsA = uniq(selects);
  const selectsB = selectsA
    .map(selectA => parseSelectPart({ top, select: selectA }));
  const selectsC = addParentSelects({ selects: selectsB });
  const selectsD = groupValuesBy(selectsC, 'commandpath');
  const actions = selectsD
    .map(selectA => getAction({ select: selectA, top, schema }));
  return actions;
};

// Turns `args.select` 'aaa.bbb.ccc=ddd' into:
// `commandpath` 'aaa.bbb', `key` 'ccc', `alias` 'ddd']
const parseSelectPart = function ({ top, select }) {
  const selectA = select.trim() === '' ? 'all' : select;
  const selectB = [...top.commandpath, selectA].join('.');
  const [, commandpath, key, , alias] = SELECT_REGEXP.exec(selectB) || [];

  validateSelectPart({ select, commandpath, key });

  return { commandpath, key, alias };
};

const SELECT_REGEXP = /^([^=]*)\.([^.=]+)(=(.+))?$/;

// From `args` + map of `COMMANDPATH: [{ commandpath, key, alias }]`
// to array of `{ commandpath, args, select: [{ key, alias }], modelname }`
const getAction = function ({
  select,
  select: [{ commandpath }],
  top,
  schema,
}) {
  const commandpathA = commandpath.split('.');
  const selectA = select.map(action => omit(action, 'commandpath'));
  const modelname = getModelname({ commandpath: commandpathA, top, schema });
  return { commandpath: commandpathA, args: {}, select: selectA, modelname };
};

// Add `action.modelname`
const getModelname = function ({
  commandpath,
  top,
  schema: { shortcuts: { modelsMap } },
}) {
  const model = getModel({ commandpath, modelsMap, top });
  if (model !== undefined) { return model.modelname; }

  const message = `In argument 'select', attribute '${commandpath.join('.')}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parseSelect,
};
