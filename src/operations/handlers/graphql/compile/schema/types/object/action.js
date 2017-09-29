'use strict';

const { mapValues } = require('../../../../../../../utilities');
const { getActionConstant } = require('../../../../../../../constants');

// Nested attributes change current action
const addActions = function ({ fields, parentDef }) {
  return mapValues(fields, def => addAction({ def, parentDef }));
};

const addAction = function ({ def, parentDef }) {
  if (def.action) { return def; }

  if (!def.target) {
    return { ...def, action: parentDef.action };
  }

  const action = getActionConstant({
    actionType: parentDef.action.type,
    isArray: def.isArray,
  });
  return { ...def, action };
};

module.exports = {
  addActions,
};
