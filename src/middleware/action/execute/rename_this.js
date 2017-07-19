'use strict';

const { reduceAsync } = require('../../../utilities');

const renameThis = async function ({ input, actions }) {
  const finalResponse = await reduceAsync(actions, async (
    formerResponse,
    { getArgs, test: testFunc, skipResponse },
  ) => {
    const argsArgs = Object.assign({ input }, formerResponse);
    const argsInput = getArgs(argsArgs);
    const nextInput = Object.assign({}, argsArgs, argsInput);

    if (testFunc && !testFunc(nextInput)) { return formerResponse; }

    const response = await this.next(nextInput);
    return skipResponse ? formerResponse : response;
  }, {});
  return finalResponse;
};

module.exports = {
  renameThis,
};
