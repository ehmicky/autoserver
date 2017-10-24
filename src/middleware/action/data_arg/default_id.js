'use strict';

const { v4: uuidv4 } = require('uuid');

const { runSchemaFunc } = require('../../../schema_func');

// Add default model.id for create commands, in order of priority:
//  - nested `args.data` attribute (not handled here)
//  - current model's 'id' attribute's schema 'default'
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
const applySchemaDefault = function ({
  model: { modelName },
  top: { command },
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
  const { [modelName]: { getDefaultId } } = dbAdapters;
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
