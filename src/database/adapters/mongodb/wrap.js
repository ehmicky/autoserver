'use strict';

const { throwError } = require('../../../error');

// Wrap each CRUD command
const wrapCommand = async function (func, commandInput, ...args) {
  const { command, connection, modelName } = commandInput;

  // Add convenience input `collection`
  const collection = connection.collection(modelName);
  const commandInputA = { ...commandInput, collection };

  const returnValue = await func(commandInputA, ...args);

  // MongoDB read commands return models as is, but write commands return
  // a summary
  if (command === 'find') { return returnValue; }

  validateWrongResult({ returnValue });
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
  wrapCommand,
};
