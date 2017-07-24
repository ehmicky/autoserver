'use strict';

const { Jsl } = require('../../jsl');

// Sets up JSL helper
const setJsl = async function (nextFunc, input) {
  const { protocol, idl: { helpers, exposeMap } } = input;

  const firstJsl = new Jsl({ exposeMap });
  const jsl = firstJsl.addHelpers({ helpers });
  Object.assign(input, { jsl });

  const nextInput = jsl.addToInput(input, { $PROTOCOL: protocol });

  const response = await nextFunc(nextInput);
  return response;
};

module.exports = {
  setJsl,
};
