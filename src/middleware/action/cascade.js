'use strict';

const { isEqual } = require('lodash');

const { throwError } = require('../../error');

const { getModel } = require('./get_model');
const { mergeActions } = require('./merge');

// Parse `args.cascade` into a set of delete nested `actions`
const parseCascade = function ({
  actions,
  top,
  top: { args: { cascade } },
  schema: { shortcuts: { modelsMap } },
}) {
  if (cascade === undefined) { return { actions }; }

  const actionsA = getCascadeActions({ cascade, top, modelsMap });

  const newActions = addMiddleActions({ actions: actionsA, top, modelsMap });

  const actionsB = mergeActions({ actions, newActions });

  return { actions: actionsB };
};

const getCascadeActions = function ({ cascade, top, modelsMap }) {
  const actions = cascade.split(',')
    .map(attrName => attrName.split('.'))
    .filter(isUnique)
    .map(attrName => normalizeCascade({ attrName, top, modelsMap }));
  return actions;
};

// Remove duplicates
const isUnique = function (attrName, index, attrNames) {
  return attrNames
    .slice(index + 1)
    .every(attrNameA => !isEqual(attrName, attrNameA));
};

// From `attr.child_attr` to:
//   commandPath: ['commandName', 'attr', 'child_attr']
//   command
//   modelName
//   args: {}
const normalizeCascade = function ({
  attrName,
  top,
  top: { command },
  modelsMap,
}) {
  const commandPath = [...top.commandPath, ...attrName];
  const model = getModel({ modelsMap, top, commandPath });

  validateCascade({ model, commandPath });

  const { modelName } = model;
  return { commandPath, command, modelName, args: {} };
};

const validateCascade = function ({ model, commandPath }) {
  if (model !== undefined) { return; }

  const attrName = commandPath.slice(1).join('.');
  const message = attrName === ''
    ? '\'cascade\' argument cannot contain empty attributes'
    : `In 'cascade' argument, attribute '${attrName}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

// When specifying `args.cascade` `parent.child` but not `parent`, it is added
// with `args.dryrun` `true`, so it can be used in response.
const addMiddleActions = function ({ actions, modelsMap, top }) {
  const middleActions = actions
    .map(action => getMiddleAction({ action, actions, modelsMap, top }))
    .filter(action => action !== undefined);
  return [...actions, ...middleActions];
};

const getMiddleAction = function ({
  action: { commandPath },
  actions,
  modelsMap,
  top,
  top: { command },
}) {
  const parentPath = commandPath.slice(0, -1);
  const presentActions = actions
    .filter(actionA => isEqual(actionA.commandPath, parentPath));
  if (presentActions.length > 0) { return; }

  const { modelName } = getModel({ modelsMap, top, commandPath: parentPath });
  const args = { dryrun: true };

  return { commandPath: parentPath, command, modelName, args };
};

module.exports = {
  parseCascade,
};
