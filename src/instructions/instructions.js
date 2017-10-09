'use strict';

const { runServer } = require('../run');
const { compileSchema } = require('../schema');

const { addErrorHandlers } = require('./error');

const instructionsA = {
  run: runServer,
  compile: compileSchema,
};

const instructions = addErrorHandlers({ instructions: instructionsA });

module.exports = instructions;
