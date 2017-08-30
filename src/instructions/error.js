'use strict';

const { mapValues } = require('../utilities');
const { addErrorHandler, getStandardError, rethrowError } = require('../error');

// Every instruction should throw standard errors
const addErrorHandlers = function ({ instructions }) {
  return mapValues(
    instructions,
    (instruction, instructionName) => addErrorHandler(
      instruction,
      instructionHandler.bind(null, instructionName),
    ),
  );
};

const instructionHandler = function (instructionName, error) {
  const {
    description = `Could not perform instruction '${instructionName}'.`,
    ...errorA
  } = getStandardError({ error });

  rethrowError({ ...errorA, description });
};

module.exports = {
  addErrorHandlers,
};
