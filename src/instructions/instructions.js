'use strict';

const { runServer } = require('../run');
const { compileIdl } = require('../idl');

const { addErrorHandlers } = require('./error');

const instructionsA = {
  run: runServer,
  compile: compileIdl,
};

const instructions = addErrorHandlers({ instructions: instructionsA });

module.exports = instructions;
