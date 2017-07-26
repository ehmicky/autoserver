'use strict';

const { Jsl, getHelpers } = require('../../jsl');

// Sets up JSL helper
const setJsl = async function (nextFunc, input) {
  const { protocol, idl } = input;

  const firstJsl = new Jsl();
  const helpers = getHelpers({ idl });
  const jsl = firstJsl.add(helpers, { type: 'USER' });
  Object.assign(input, { jsl });

  const nextInput = jsl.addToInput(input, { $PROTOCOL: protocol });

  const response = await nextFunc(nextInput);
  return response;
};

module.exports = {
  setJsl,
};
