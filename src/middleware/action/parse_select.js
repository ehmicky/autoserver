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
  const selectsA = groupValuesBy(selects, 'commandPath');
  const actions = selectsA
    .map(selectA => getAction({ select: selectA, top, schema }));
  return actions;
};

// Turns `args.select` 'aaa.bbb.ccc=ddd' into:
// `commandPath` 'aaa.bbb', `key` 'ccc', `alias` 'ddd']
const parseSelectPart = function ({ top, select }) {
  const selectA = [...top.commandPath, select].join('.');
  const [, commandPath, key, alias] = SELECT_REGEXP.exec(selectA);
  return { commandPath, key, alias };
};

const SELECT_REGEXP = /^([^=]*)\.([^.=]+)=?(.*)?$/;

// From `args` + map of `COMMAND_PATH: [{ commandPath, key, alias }]`
// to array of `{ commandPath, args, select: [{ key, alias }], modelName }`
const getAction = function ({
  select,
  select: [{ commandPath }],
  top,
  schema,
}) {
  const commandPathA = commandPath.split('.');
  const selectA = select.map(action => omit(action, 'commandPath'));
  const modelName = getModelName({ commandPath: commandPathA, top, schema });
  return { commandPath: commandPathA, args: {}, select: selectA, modelName };
};

// Add `action.modelName`
const getModelName = function ({
  commandPath,
  top,
  schema: { shortcuts: { modelsMap } },
}) {
  const model = getModel({ commandPath, modelsMap, top });
  if (model !== undefined) { return model.modelName; }

  const message = `In argument 'select', attribute '${commandPath.join('.')}' is unknown`;
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
  action: { isWrite, commandPath },
  command,
}) {
  if (isWrite || commandPath.length <= 1) { return; }

  const path = commandPath.slice(1).join('.');
  const argName = command.type === 'delete' ? 'cascade' : 'data';
  const message = `Can only 'select' attribute '${path}' if it is specified in '${argName}' argument`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parseSelect,
};
