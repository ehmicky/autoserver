'use strict';

const { isEqual } = require('lodash');

const { assignArray } = require('../../utilities');
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

  const actionsB = mergeActions({ actions, actionsA });

  return { actions: actionsB };
};

const getCascadeActions = function ({ cascade, top, modelsMap }) {
  const actions = cascade.split(',')
    .map(parseCascadePart)
    .reduce(assignArray, [])
    .filter(isUnique)
    .map(attrName => normalizeCascade({ attrName, top, modelsMap }));
  return actions;
};

// `args.cascade` `parent.child` is same as `parent,parent.child`
const parseCascadePart = function (attrName) {
  const attrs = attrName.split('.');

  return Array(attrs.length)
    .fill(null)
    .map((val, index) => attrs.slice(0, index + 1));
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

module.exports = {
  parseCascade,
};
