'use strict';

const { throwError } = require('../../error');

const { getModel } = require('./get_model');

// Add `action.modelName`
const parseModels = function ({ actions, top, schema }) {
  const actionsA = actions.map(action => addModelName({ action, top, schema }));
  return { actions: actionsA };
};

const addModelName = function ({ action, top, schema }) {
  const modelName = getModelName({ action, top, schema });
  return { ...action, modelName };
};

const getModelName = function ({
  action: { commandPath },
  top,
  schema: { shortcuts: { modelsMap } },
}) {
  if (commandPath.length === 1) {
    return top.modelName;
  }

  const model = getModel({ commandPath, modelsMap, top });

  if (model === undefined) {
    const message = `Attribute '${commandPath.join('.')}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return model.modelName;
};

module.exports = {
  parseModels,
};
