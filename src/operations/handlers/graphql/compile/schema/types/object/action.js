'use strict';

const { mapValues } = require('../../../../../../../utilities');
const { ACTIONS } = require('../../../../../../../constants');

// Nested attributes change current action
const addActions = function ({ fields, parentDef }) {
  return mapValues(fields, def => addAction({ def, parentDef }));
};

const addAction = function ({ def, parentDef }) {
  if (def.action) { return def; }

  if (!def.target) {
    return { ...def, action: parentDef.action };
  }

  const action = ACTIONS.find(ACTION =>
    ACTION.type === parentDef.action.type &&
    ACTION.multiple === def.isArray
  );
  return { ...def, action };
};

module.exports = {
  addActions,
};
