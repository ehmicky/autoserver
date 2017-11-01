'use strict';

const { uniq, includes } = require('../../utilities');
const { throwError } = require('../../error');

const { getModel } = require('./get_model');

// Parse `args.cascade` into a set of delete nested `actions`
const parseCascade = function ({
  actions,
  top,
  top: { args: { cascade } },
  schema: { shortcuts: { modelsMap } },
}) {
  if (cascade === undefined) { return { actions }; }

  const actionsA = getCascadeActions({ cascade, top, modelsMap });

  return { actions: actionsA };
};

const getCascadeActions = function ({ cascade, top, modelsMap }) {
  const actions = cascade.split(',');
  const actionsA = uniq(actions);
  const actionsB = actionsA.map(attrName => attrName.split('.'));
  const actionsC = actionsB.map((attrName, index, attrs) =>
    normalizeCascade({ attrName, attrs, top, modelsMap }));
  return actionsC;
};

// From `attr.child_attr` to:
//   commandPath: ['commandName', 'attr', 'child_attr']
//   command
//   modelName
//   args: {}
const normalizeCascade = function ({
  attrName,
  attrs,
  top,
  top: { command },
  modelsMap,
}) {
  validateMiddleAction({ attrName, attrs });

  const commandPath = [...top.commandPath, ...attrName];
  const model = getModel({ modelsMap, top, commandPath });

  validateCascade({ model, commandPath });

  const { modelName } = model;
  return { commandPath, command, modelName, args: {} };
};

// Cannot specify `args.cascade` `parent.child` but not `parent`.
// Otherwise, this would require create an intermediate `find` action.
const validateMiddleAction = function ({ attrName, attrs }) {
  if (attrName.length <= 1) { return; }

  const parentAttr = attrName.slice(0, -1);
  const hasParentAttr = includes(attrs, parentAttr);
  if (hasParentAttr) { return; }

  const message = `In 'cascade' argument, must not specify '${attrName.join('.')}' unless '${parentAttr.join('.')}' is also specified`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
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
