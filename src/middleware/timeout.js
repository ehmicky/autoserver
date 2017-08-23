'use strict';

const { throwError } = require('../error');
const { pSetTimeout } = require('../utilities');

// Make request fail after some timeout
const setRequestTimeout = function (input, nextLayer) {
  const timeoutPromise = startRequestTimeout({ input });
  const nextLayerPromise = nextLayer(input);

  return Promise.race([timeoutPromise, nextLayerPromise]);
};

const startRequestTimeout = async function ({ input: { runOpts: { env } } }) {
  // When debugging with breakpoints, we do not want any request timeout
  const timeout = env === 'dev' ? 1e9 : REQUEST_TIMEOUT;

  // Note that the timeout is a minimum, since it will only be fired at the
  // beginning of a new macrotask
  await pSetTimeout(timeout);

  const message = `The request took too long (more than ${timeout / 1000} seconds)`;
  throwError(message, { reason: 'REQUEST_TIMEOUT' });
};

const REQUEST_TIMEOUT = 5000;

module.exports = {
  setRequestTimeout,
};
