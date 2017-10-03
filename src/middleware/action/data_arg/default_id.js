'use strict';

const { v4: uuidv4 } = require('uuid');

const { runIdlFunc } = require('../../../idl_func');

// Add default model.id for create commands, in order of priority:
//  - nested `args.data` attribute (not handled here)
//  - current model's 'id' attribute's IDL 'default'
//  - database adapter-specific function
//  - UUIDv4
const addDefaultIds = function ({ datum, top, top: { command }, ...rest }) {
  const shouldAddDefaultId = command.type === 'create' && datum.id == null;
  if (!shouldAddDefaultId) { return datum; }

  const id = handlers.reduce(
    getIdDefault.bind(null, { ...rest, top, datum }),
    null,
  );

  if (id == null) { return datum; }

  return { ...datum, id };
};

// Try each way to set default, in order
const getIdDefault = function (input, idA, handler) {
  if (idA != null) { return idA; }

  return handler(input);
};

// Apply default current model's 'id' attribute
const applyIdlDefault = function ({
  model: { modelName },
  top: { command },
  datum,
  userDefaultsMap,
  mInput,
}) {
  const idlFunc = userDefaultsMap[modelName].id;
  const vars = { $$: datum };
  const mInputA = { ...mInput, modelName, command: command.type };
  return runIdlFunc({ idlFunc, mInput: mInputA, vars });
};

// UUID default fallback
const applyUuid = function () {
  return uuidv4();
};

const handlers = [
  applyIdlDefault,
  applyUuid,
];

module.exports = {
  addDefaultIds,
};
