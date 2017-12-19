'use strict';

const { find } = require('./find');
const { delete: deleteFunc } = require('./delete');
const { upsert } = require('./upsert');

// CRUD commands
const query = async function (commandInput, ...args) {
  const { command, connection, collname } = commandInput;

  // Add convenience input `collection`
  const collection = connection.collection(collname);
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
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

module.exports = {
  query,
};
