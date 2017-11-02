'use strict';

const { get } = require('../../../../utilities');

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
  return requiredArgs
    .find(argName => {
      const path = argName.split('.');
      return get(args, path) == null;
    });
};

module.exports = {
  getRequiredTests,
};
