'use strict';

const { runServer } = require('../run');

const { addErrorHandlers } = require('./error');

const instructionsA = {
  run: runServer,
};

const instructions = addErrorHandlers({ instructions: instructionsA });

module.exports = {
  instructions,
};
