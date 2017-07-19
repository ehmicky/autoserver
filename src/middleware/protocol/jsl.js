'use strict';

const { Jsl } = require('../../jsl');

// Sets up JSL helper
const setJsl = async function (input) {
  const { protocol, idl: { helpers, exposeMap } } = input;

  const jsl = new Jsl({ exposeMap });
  const jslWithHelpers = jsl.addHelpers({ helpers });
  const newJsl = jslWithHelpers.add({ $PROTOCOL: protocol });

  Object.assign(input, { jsl: newJsl });

  const response = await this.next(input);
  return response;
};

module.exports = {
  setJsl,
};
