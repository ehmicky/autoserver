'use strict';

const { groupValuesBy, omit } = require('../../utilities');
const { throwError } = require('../../error');

const { getModel } = require('./get_model');
const { addActions } = require('./add_actions');

// Turn `args.select` into a set of `actions`
const parseSelect = function ({ actions, ...rest }) {
  const actionsA = addActions({
    actions,
    filter: ({ select }) => select !== undefined,
    mapper: getSelectAction,
    ...rest,
  });

  validateSelect({ actions: actionsA, ...rest });

  return { actions: actionsA };
};

const getSelectAction = function ({
  action: { args: { select } },
  top,
  schema,
}) {
  const selects = select
    .split(',')
    .map(selectA => parseSelectPart({ top, select: selectA }));
  const selectsA = groupValuesBy(selects, 'commandpath');
  const actions = selectsA
    .map(selectA => getAction({ select: selectA, top, schema }));
  return actions;
};

// Turns `args.select` 'aaa.bbb.ccc=ddd' into:
// `commandpath` 'aaa.bbb', `key` 'ccc', `alias` 'ddd']
const parseSelectPart = function ({ top, select }) {
  const selectA = [...top.commandpath, select].join('.');
  const [, commandpath, key, alias] = SELECT_REGEXP.exec(selectA);
  return { commandpath, key, alias };
};

const SELECT_REGEXP = /^([^=]*)\.([^.=]+)=?(.*)?$/;

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

const validateSelect = function ({ actions, top: { command } }) {
  if (command.type === 'find') { return; }

  actions.forEach(action => validateAction({ action, command }));
};

// Write actions can only select attributes that are part of the write action
// itself, i.e. in `args.data|cascade`.
// Otherwise, this would require performing extra find actions.
const validateAction = function ({
  action: { isWrite, commandpath },
  command,
}) {
  if (isWrite || commandpath.length <= 1) { return; }

  const path = commandpath.slice(1).join('.');
  const argName = command.type === 'delete' ? 'cascade' : 'data';
  const message = `Can only 'select' attribute '${path}' if it is specified in '${argName}' argument`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parseSelect,
};
