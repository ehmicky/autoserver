'use strict';

const { uniq } = require('lodash');

const { mapValues, assignArray, pick } = require('../../../../../../utilities');

const actionsArgs = require('./actions');
const {
  getRequiredTests,
  getUnknownTests,
  ...normalTests
} = require('./tests');

// Retrieve argument-related tests for all actions
const getActionsTests = function () {
  return mapValues(actionsArgs, getActionTests);
};

// Retrieve argument-related tests for each action
const getActionTests = function ({ optional, required }) {
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
  // Each action has a different set of tests
  const testsA = pick(normalTests, testNames);
  const testsB = mapValues(testsA, addArgName);
  const testsC = Object.values(testsB).reduce(assignArray, []);
  const testsD = testsC.map(addMessagePrefix);
  return testsD;
};

// Add `test.argName`, which defaults to test key, and represents argument name
const addArgName = function (tests, key) {
  return tests
    .map(({ argName = key, ...params }) => ({ ...params, argName }));
};

// Prefix error message with argument name
const addMessagePrefix = function (argTest) {
  const { message, argName } = argTest;
  if (typeof message !== 'string') { return argTest; }

  const messageA = `'${argName}' ${message}`;
  return { ...argTest, message: messageA };
};

// Retrieve argument-related tests that fire a function
const getSpecialTests = function ({ argsTests, getter }) {
  const args = argsTests.map(({ argName }) => argName);
  const argsA = uniq(args);
  return getter(argsA);
};

// Compile the list of tests parse-time
const actionsTests = getActionsTests();

module.exports = {
  actionsTests,
};
