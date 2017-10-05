'use strict';

const { throwError } = require('../../error');

const { getModel } = require('./get_model');

// Validate that attributes used in nested actions will not change
// If a nested action is performed by the client, but the server changes its
// parent attribute with `attr.value`, the relation returned in the response
// will show what the client asked for, but the server state will contain
// something else.
const validateStableIds = function ({ actions, idl, top, top: { command } }) {
  // Only for commands with `args.data`
  if (!stableIdsCommands.includes(command.type)) { return; }

  actions
    // Only for nested actions
    .filter(({ commandPath }) => commandPath.length > 1)
    .forEach(action => validateAction({ action, idl, top }));
};

const stableIdsCommands = ['create', 'patch', 'replace'];

const validateAction = function ({
  action: { commandPath },
  idl: { shortcuts: { modelsMap, valuesMap } },
  top,
}) {
  const parentPath = commandPath.slice(0, -1);
  const { modelName: parentModel } = getModel({
    commandPath: parentPath,
    modelsMap,
    top,
  });
  const attrName = commandPath[commandPath.length - 1];

  if (valuesMap[parentModel][attrName] === undefined) { return; }

  const path = commandPath.slice(1).join('.');
  const message = `Cannot nest 'data' argument on the attribute '${path}'. That attribute's value is set by the server, so the nested model's 'id' cannot be known by the client.`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  validateStableIds,
};
