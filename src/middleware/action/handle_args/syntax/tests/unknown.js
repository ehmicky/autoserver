'use strict';

// Validate unknown arguments
const getUnknownTests = allowedArgs => [{
  test (args) {
    const unknownArg = findUnknownArg({ allowedArgs, args });
    return unknownArg !== undefined;
  },
  message (args) {
    const unknownArg = findUnknownArg({ allowedArgs, args });
    return `'${unknownArg}' is an unknown argument`;
  },
}];

const findUnknownArg = function ({ allowedArgs, args }) {
  return Object.keys(args).find(argName => !allowedArgs.includes(argName));
};

module.exports = {
  getUnknownTests,
};
