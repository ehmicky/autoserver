'use strict';

const { getHelpers, addJslToInput } = require('../../jsl');

// Sets up JSL helper
const setJsl = async function (nextFunc, input) {
  const { protocol, idl } = input;

  const helpers = getHelpers({ idl });
  const newInput = addJslToInput(input, {}, helpers, { type: 'USER' });

  const params = { $PROTOCOL: protocol };
  const nextInput = addJslToInput(newInput, newInput.jsl, params);

  const response = await nextFunc(nextInput);
  return response;
};

module.exports = {
  setJsl,
};
