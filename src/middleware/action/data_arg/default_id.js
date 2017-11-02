'use strict';

const { v4: uuidv4 } = require('uuid');

const { runSchemaFunc } = require('../../../schema_func');

// Add default model.id for create commands, in order of priority:
//  - nested `args.data` attribute (not handled here)
//  - current model's 'id' attribute's schema 'default'
//  - database adapter-specific function
//  - UUIDv4
const addDefaultIds = function ({ datum, top: { command }, ...rest }) {
  const shouldAddDefaultId = command.type === 'create' && datum.id == null;
  if (!shouldAddDefaultId) { return datum; }

  const id = handlers.reduce(
    getIdDefault.bind(null, { ...rest, datum, command }),
    null,
  );

  if (id == null) { return datum; }

  return { ...datum, id };
};

// Try each way to set default, in order
const getIdDefault = function (input, id, handler) {
  if (id != null) { return id; }

  return handler(input);
};

// Apply default current model's 'id' attribute
const applySchemaDefault = function ({
  model: { modelName },
  command,
  datum,
  userDefaultsMap,
  mInput,
}) {
  const schemaFunc = userDefaultsMap[modelName].id;
  const vars = { $model: datum };
  const mInputA = { ...mInput, modelName, command: command.type };
  return runSchemaFunc({ schemaFunc, mInput: mInputA, vars });
};

// Apply database adapter-specific id default, i.e. adater.getDefaultId()
// Database adapters should prefer using UUID, to keep it consistent
const applyDatabaseDefault = function ({ model: { modelName }, dbAdapters }) {
  const { getDefaultId } = dbAdapters[modelName];
  if (getDefaultId === undefined) { return; }

  return getDefaultId();
};

// UUID default fallback
const applyUuid = function () {
  return uuidv4();
};

const handlers = [
  applySchemaDefault,
  applyDatabaseDefault,
  applyUuid,
];

module.exports = {
  addDefaultIds,
};
