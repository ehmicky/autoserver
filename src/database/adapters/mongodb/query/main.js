'use strict';

const { throwError } = require('../../../../error');

const { find } = require('./find');
const { delete: deleteFunc } = require('./delete');
const { upsert } = require('./upsert');

// CRUD commands
const query = async function (commandInput, ...args) {
  const { command, connection, modelName } = commandInput;

  // Add convenience input `collection`
  const collection = connection.collection(modelName);
  const commandInputA = { ...commandInput, collection };

  const returnValue = await commands[command](commandInputA, ...args);

  // MongoDB read commands return models as is, but write commands return
  // a summary
  if (command === 'find') { return returnValue; }

  validateWrongResult({ returnValue });
};

const commands = {
  find,
  delete: deleteFunc,
  upsert,
};

// MongoDB returns `result.ok` `0` when an error happened
const validateWrongResult = function ({
  returnValue: { result: { ok, errmsg, code } = {} },
}) {
  if (ok === 1) { return; }

  const codeA = code === undefined ? '' : ` (code ${code})`;
  const message = `${errmsg}${codeA}`;
  throwError(message, { reason: 'DB_ERROR' });
};

module.exports = {
  query,
};
