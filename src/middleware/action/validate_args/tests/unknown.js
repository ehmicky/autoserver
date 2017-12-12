'use strict';

// Validate unknown arguments
const getUnknownTests = allowedArgs => [{
  test (args) {
    const unknownArg = findUnknownArg({ allowedArgs, args });
    return unknownArg == null;
  },
  message (args) {
    const unknownArg = findUnknownArg({ allowedArgs, args });
    return `'${unknownArg}' is an unknown argument`;
  },
}];

const findUnknownArg = function ({ allowedArgs, args }) {
  const allowedArgsA = ['config', ...allowedArgs];
  return Object.keys(args).find(argName => !allowedArgsA.includes(argName));
};

module.exports = {
  getUnknownTests,
};
