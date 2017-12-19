'use strict';

const {
  difference,
  getWordsList,
  flatten,
  omit,
  uniq,
} = require('../../../utilities');
const { throwError } = require('../../../errors');

const { getValues } = require('./values');

// Add values to current actions
const addToActions = function ({ actions, name, filter, mapper, top }) {
  const values = getValues({ actions, filter, mapper });

  const actionsA = actions.map(action => addValue({ action, values, name }));

  validateAll({ actions, name, values, top });

  return actionsA;
};

const addValue = function ({
  action,
  action: { args, commandpath },
  values,
  name,
}) {
  const commandpathA = commandpath.join('.');
  const valueA = values
    .map(value => value[commandpathA])
    .filter(value => value !== undefined);
  const argsA = valueA.length === 0
    ? omit(args, name)
    : { ...args, [name]: valueA };

  return { ...action, args: argsA };
};

// Validate we are adding attributes in actions that are present|populated
const validateAll = function ({ name, actions, values, top }) {
  const wrongPaths = getWrongPaths({ actions, values });
  if (wrongPaths.length === 0) { return; }

  const wrongPathsA = getWordsList(wrongPaths, { op: 'and', quotes: true });
  const relatedArg = RELATED_ARG[top.command.type];
  const message = `In '${name}' argument, must not specify ${wrongPathsA} unless it is also specified in argument '${relatedArg}'`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const getWrongPaths = function ({ actions, values }) {
  const actionPaths = actions.map(({ commandpath }) => commandpath.join('.'));

  const valuePaths = values.map(Object.keys);
  const valuePathsA = flatten(valuePaths);
  const valuePathsC = uniq(valuePathsA);

  const wrongPaths = difference(valuePathsC, actionPaths);
  return wrongPaths;
};

// Cannot add that attribute unless it's already populated by one of the
// following arguments
const RELATED_ARG = {
  find: 'populate',
  delete: 'cascade',
  patch: 'data',
  create: 'data',
  upsert: 'data',
};

module.exports = {
  addToActions,
};
