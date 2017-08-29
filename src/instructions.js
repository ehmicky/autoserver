'use strict';

const { runServer } = require('./run');
const { compileIdl } = require('./idl');

module.exports = {
  run: runServer,
  compile: compileIdl,
};
