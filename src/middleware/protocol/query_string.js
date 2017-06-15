'use strict';


const { transtype, mapValues, makeImmutable } = require('../../utilities');


// Fill in `input.queryVars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
// Meant to be used to create (in coming middleware) `input.settings` and
// `input.params`, but can also be used by operation layer as is.
const parseQueryString = function () {
  return async function parseQueryString(input) {
    const { specific, protocolHandler, log } = input;
    const perf = log.perf.start('protocol.parseQueryString', 'middleware');

    const queryVars = getQueryVars({ specific, protocolHandler });
    makeImmutable(queryVars);

    log.add({ queryVars });
    Object.assign(input, { queryVars });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

// Retrieves query variables
const getQueryVars = function ({ specific, protocolHandler }) {
  const queryVars = protocolHandler.parseQueryString({ specific });

  const transtypedQueryVars = mapValues(queryVars, value => transtype(value));

  return transtypedQueryVars;
};


module.exports = {
  parseQueryString,
};
