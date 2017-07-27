'use strict';

const { getHelpers, addJsl } = require('../../jsl');

// Sets up JSL helper
const setJsl = async function (nextFunc, input) {
  const { protocol, idl } = input;

  const helpers = getHelpers({ idl });
  const newInput = addJsl({ input, params: helpers, type: 'USER' });

  const nextInput = addJsl({
    input: newInput,
    jsl: newInput.jsl,
    params: { $PROTOCOL: protocol },
  });

  const response = await nextFunc(nextInput);
  return response;
};

module.exports = {
  setJsl,
};
