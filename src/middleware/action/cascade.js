'use strict';

const { throwError } = require('../../error');
const { uniq, includes } = require('../../utilities');

const { getModel } = require('./get_model');
const { addActions } = require('./add_actions');

// Parse `args.cascade` into a set of delete nested `actions`
const parseCascade = function ({ actions, ...rest }) {
  const actionsA = addActions({
    actions,
    filter: ({ args: { cascade } }) => cascade !== undefined,
    mapper: getCascadeActions,
    ...rest,
  });
  return { actions: actionsA };
};

const getCascadeActions = function ({
  top,
  action: { args: { cascade } },
  schema: { shortcuts: { modelsMap } },
}) {
  const attrs = cascade.split(',');
  const attrsA = uniq(attrs);
  const attrsB = attrsA.map(attrName => attrName.split('.'));
  const actions = attrsB.map(attrName =>
    getCascadeAction({ attrName, attrs: attrsB, top, modelsMap }));
  return actions;
};

// From `attr.child_attr` to:
//   commandpath: ['commandName', 'attr', 'child_attr']
//   modelname
//   args: {}
const getCascadeAction = function ({ attrName, attrs, top, modelsMap }) {
  validateMiddleAction({ attrName, attrs });

  const commandpath = [...top.commandpath, ...attrName];
  const model = getModel({ modelsMap, top, commandpath });

  validateCascade({ model, commandpath });

  const { modelname } = model;
  return { commandpath, modelname, args: {}, isWrite: true };
};

// Cannot specify `args.cascade` `parent.child` but not `parent`.
// Otherwise, this would require create an intermediate `find` action.
const validateMiddleAction = function ({ attrName, attrs }) {
  // Not for top-level attributes
  if (attrName.length <= 1) { return; }

  const parentAttr = attrName.slice(0, -1);
  const hasParentAttr = includes(attrs, parentAttr);
  if (hasParentAttr) { return; }

  const message = `In 'cascade' argument, must not specify '${attrName.join('.')}' unless '${parentAttr.join('.')}' is also specified`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateCascade = function ({ model, commandpath }) {
  if (model !== undefined) { return; }

  const attrName = commandpath.slice(1).join('.');
  const message = attrName === ''
    ? '\'cascade\' argument cannot contain empty attributes'
    : `In 'cascade' argument, attribute '${attrName}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parseCascade,
};
