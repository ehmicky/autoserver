'use strict';

const { throwError } = require('../../../../error');

const validateUnknownAttrs = function ({ actions, modelsMap }) {
  actions.forEach(action => validateAction({ action, modelsMap }));
  return actions;
};

const validateAction = function ({
  action: { select, actionPath, modelName },
  modelsMap,
}) {
  const attr = select
    .find(({ dbKey }) => modelsMap[modelName][dbKey] === undefined);
  if (!attr) { return; }

  const path = [...actionPath, attr.dbKey].join('.');
  const message = `Attribute '${path}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateUnknownAttrs,
};
