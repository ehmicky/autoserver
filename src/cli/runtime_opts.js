'use strict';

const yargs = require('yargs');
const { isEqual } = require('lodash');

const { recursePickBy, omit } = require('../utilities');

const { addCommands, addCommandsExamples } = require('./commands');

// CLI input parsing
const getRuntimeOpts = function () {
  const opts = parseOpts();
  const optsA = cleanOpts({ opts });
  return optsA;
};

// Main parsing
const parseOpts = function () {
  const yargsA = addCommands({ yargs });
  const yargsB = addCommandsExamples({ yargs: yargsA });
  return yargsB
    // There should be a single command, or none (default one)
    .demandCommand(1, 1)
    // No unknown commands nor options
    .strict()
    // --help option
    .usage(usage)
    .help()
    // --version option
    .version()
    .default(['help', 'version'], undefined)
    // `completion` command, which outputs Bash completion script
    .completion()
    // Auto-suggests correction on typos
    .recommendCommands()
    .argv;
};

const cleanOpts = function ({ opts }) {
  const optsA = recursePickBy(opts, isCorrectOpt);
  // Remove parser-specific values
  const optsB = omit(optsA, ['_', '$0']);
  return optsB;
};

const isCorrectOpt = function (val, name) {
  // Remove empty values
  if (val === undefined || isEqual(val, {})) { return false; }

  // Remove dasherized options
  if (dasherizedRegExp.test(name)) { return false; }

  return true;
};

const dasherizedRegExp = /-/;

const usage = `apiengine COMMAND [OPTIONS]

Engine generating an API from a simple configuration file.`;

module.exports = {
  getRuntimeOpts,
};
