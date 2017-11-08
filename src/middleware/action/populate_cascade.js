'use strict';

const { uniq, includes } = require('../../utilities');
const { throwError } = require('../../error');

const { getModel } = require('./get_model');
const { addActions } = require('./add_actions');

// Parse `args.populate|cascade` into a set of nested `actions`
const parsePopulateCascade = function ({ actions, ...rest }) {
  const actionsA = addActions({
    actions,
    filter: ({ args: { populate, cascade } }) =>
      populate !== undefined || cascade !== undefined,
    mapper: getActions,
    ...rest,
  });
  return { actions: actionsA };
};

const getActions = function ({
  top,
  top: { command },
  action: { args },
  schema: { shortcuts: { modelsMap } },
}) {
  const argName = ARG_NAMES[command.type];
  const arg = args[argName];

  const attrs = arg.split(',');
  const attrsA = uniq(attrs);
  const attrsB = attrsA.map(attrName => attrName.split('.'));
  const actions = attrsB.map(attrName =>
    getAction({ attrName, attrs: attrsB, top, argName, modelsMap }));
  return actions;
};

// `args.cascade` is the alias for `args.populate` on delete actions
const ARG_NAMES = {
  find: 'populate',
  delete: 'cascade',
};

// From `attr.child_attr` to:
//   commandpath: ['commandName', 'attr', 'child_attr']
//   modelname
//   args: {}
const getAction = function ({ attrName, attrs, top, argName, modelsMap }) {
  validateMiddleAction({ attrName, attrs, argName });

  const commandpath = [...top.commandpath, ...attrName];
  const model = getModel({ modelsMap, top, commandpath });

  validateModel({ model, commandpath, argName });

  const { modelname } = model;
  const isWrite = top.command.type !== 'find';
  return { commandpath, modelname, args: {}, isWrite };
};

// Cannot specify `args.populate|cascade` `parent.child` but not `parent`.
// Otherwise, this would require create an intermediate `find` action.
const validateMiddleAction = function ({ attrName, attrs, argName }) {
  // Not for top-level attributes
  if (attrName.length <= 1) { return; }

  const parentAttr = attrName.slice(0, -1);
  const hasParentAttr = includes(attrs, parentAttr);
  if (hasParentAttr) { return; }

  const message = `In '${argName}' argument, must not specify '${attrName.join('.')}' unless '${parentAttr.join('.')}' is also specified`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateModel = function ({ model, commandpath, argName }) {
  if (model !== undefined) { return; }

  const attrName = commandpath.slice(1).join('.');
  const message = attrName === ''
    ? `'${argName}' argument cannot contain empty attributes`
    : `In '${argName}' argument, attribute '${attrName}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  parsePopulateCascade,
};
