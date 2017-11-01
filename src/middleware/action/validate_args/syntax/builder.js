'use strict';

const { mapValues, assignArray, uniq, pick } = require('../../../../utilities');

const commandsArgs = require('./commands');
const {
  getRequiredTests,
  getUnknownTests,
  ...normalTests
} = require('./tests');

// Retrieve argument-related tests for all commands
const getCommandsTests = function () {
  return mapValues(commandsArgs, getCommandTests);
};

// Retrieve argument-related tests for each command
const getCommandTests = function ({ optional, required }) {
  // Retrieve tests related to most arguments
  const requiredArgsTests = getTests({ testNames: required });
  const optionalArgsTests = getTests({ testNames: optional });
  const argsTests = [...requiredArgsTests, ...optionalArgsTests];

  // Retrieve requiredness tests
  const requiredTests = getSpecialTests({
    argsTests: requiredArgsTests,
    getter: getRequiredTests,
  });
  // Retrieve "unknown argument" tests
  const unknownTests = getSpecialTests({
    argsTests,
    getter: getUnknownTests,
  });

  return [
    ...requiredTests,
    ...unknownTests,
    ...argsTests,
  ];
};

// Retrieve argument-related tests that do not fire a function
const getTests = function ({ testNames }) {
  // Each command has a different set of tests
  const testsA = pick(normalTests, testNames);
  const testsB = mapValues(testsA, addArgName);
  const testsC = Object.values(testsB).reduce(assignArray, []);
  const testsD = testsC.map(addMessagePrefix);
  return testsD;
};

// Add `test.argName`, which defaults to test key, and represents argument name
const addArgName = function (tests, key) {
  return tests.map(({ argName = key, ...params }) => ({ ...params, argName }));
};

// Prefix error message with argument name
const addMessagePrefix = function (argTest) {
  const { message } = argTest;
  if (typeof message !== 'string') { return argTest; }

  return { ...argTest, message };
};

// Retrieve argument-related tests that fire a function
const getSpecialTests = function ({ argsTests, getter }) {
  const args = argsTests.map(({ argName }) => argName);
  const argsA = uniq(args);
  return getter(argsA);
};

// Compile the list of tests parse-time
const commandsTests = getCommandsTests();

module.exports = {
  commandsTests,
};
