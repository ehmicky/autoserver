'use strict';

// Validate required arguments
const getRequiredTests = requiredArgs => [{
  test (args) {
    const requiredArg = findMissingRequiredArg({ requiredArgs, args });
    return requiredArg == null;
  },
  message (args) {
    const requiredArg = findMissingRequiredArg({ requiredArgs, args });
    return `'${requiredArg}' must be defined`;
  },
}];

const findMissingRequiredArg = function ({ requiredArgs, args }) {
  return requiredArgs.find(argName => args[argName] == null);
};

module.exports = {
  getRequiredTests,
};
