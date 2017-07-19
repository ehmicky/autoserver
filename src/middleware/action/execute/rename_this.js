'use strict';

const { reduceAsync } = require('../../../utilities');

const renameThis = async function ({ input, actions }) {
  const finalResponse = await reduceAsync(actions, async (
    formerResponse,
    { getArgs, test: testFunc, skipResponse },
  ) => {
    const argsInput = Object.assign({}, formerResponse, { input });
    const nextInput = Object.assign({}, input, getArgs(argsInput));

    const testInput = Object.assign({}, formerResponse, { input: nextInput });
    if (testFunc && !testFunc(testInput)) { return formerResponse; }

    const response = await this.next(nextInput);
    return skipResponse ? formerResponse : response;
  }, {});
  return finalResponse;
};

module.exports = {
  renameThis,
};
