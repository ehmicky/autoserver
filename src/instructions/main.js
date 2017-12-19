'use strict';

const { runServer } = require('../run');

const { addErrorHandlers } = require('./error');

const instructions = {
  run: runServer,
};

const main = addErrorHandlers({ instructions });

module.exports = main;
