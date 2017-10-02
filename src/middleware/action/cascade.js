'use strict';

const { uniq } = require('lodash');

const { throwError } = require('../../error');

const { getModel } = require('./get_model');

const parseCascade = function ({
  actions,
  top,
  top: { args: { cascade } },
  idl: { shortcuts: { modelsMap } },
}) {
  if (cascade === undefined) { return { actions }; }

  const actionsA = getCascadeActions({ cascade, top, modelsMap });

  const actionsB = [...actions, ...actionsA];
  return { actions: actionsB };
};

const getCascadeActions = function ({ cascade, top, modelsMap }) {
  const cascadeA = cascade.split(',');
  const cascadeB = uniq(cascadeA);
  const actions = cascadeB
    .map(attrName => normalizeCascade({ attrName, top }))
    .map(cascadeArg => addModelName({ cascade: cascadeArg, top, modelsMap }));
  return actions;
};

const normalizeCascade = function ({ attrName, top, top: { command } }) {
  const attrs = attrName.split('.');
  const commandPath = [...top.commandPath, ...attrs];
  return { commandPath, command, args: {} };
};

const addModelName = function ({
  cascade: { commandPath, ...rest },
  top,
  modelsMap,
}) {
  const model = getModel({ modelsMap, top, commandPath });

  validateCascade({ model, commandPath });

  const { modelName } = model;
  return { ...rest, commandPath, modelName };
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
