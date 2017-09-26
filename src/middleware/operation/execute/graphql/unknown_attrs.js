'use strict';

const { throwError } = require('../../../../error');

const validateUnknownAttrs = function ({ actions, modelsMap }) {
  actions.forEach(action => validateAction({ action, modelsMap }));
  return actions;
};

const validateAction = function ({ action, modelsMap }) {
  validateAllAttr({ action, modelsMap });
  validateUnknown({ action, modelsMap });
};

const validateAllAttr = function ({
  action: { select, actionPath, modelName },
  modelsMap,
}) {
  const hasAllAttr = select.some(({ key }) => key === 'all');
  if (!hasAllAttr) { return; }

  const attr = select
    .filter(({ key }) => key !== 'all')
    .find(({ key }) => modelsMap[modelName][key].target === undefined);
  if (attr === undefined) { return; }

  const path = actionPath.join('.');
  const message = `At '${path}': cannot specify both 'all' and '${attr.key}' attributes`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

const validateUnknown = function ({
  action: { select, actionPath, modelName },
  modelsMap,
}) {
  const attr = select
    .filter(({ key }) => key !== 'all')
    .find(({ key }) => modelsMap[modelName][key] === undefined);
  if (attr === undefined) { return; }

  const path = [...actionPath, attr.key].join('.');
  const message = `Attribute '${path}' is unknown`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateUnknownAttrs,
};
