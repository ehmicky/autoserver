'use strict';

const { throwError } = require('../../errors');
const { pSetTimeout } = require('../../utilities');
const { getLimits } = require('../../limits');

// Make request fail after some timeout
const setRequestTimeout = function ({ mInput, config }, nextLayer) {
  const timeoutPromise = startRequestTimeout({ config });
  const nextLayerPromise = nextLayer(mInput, 'protocol');

  return Promise.race([timeoutPromise, nextLayerPromise]);
};

const startRequestTimeout = async function ({ config, config: { env } }) {
  const { requestTimeout } = getLimits({ config });
  // When debugging with breakpoints, we do not want any request timeout
  const timeout = env === 'dev' ? HUGE_TIMEOUT : requestTimeout;

  // Note that the timeout is a minimum, since it will only be fired at the
  // beginning of a new macrotask
  await pSetTimeout(timeout);

  const message = `The request took too long (more than ${timeout / MILLISECS_TO_SECS} seconds)`;
  throwError(message, { reason: 'TIMEOUT' });
};

const HUGE_TIMEOUT = 1e9;
const MILLISECS_TO_SECS = 1e3;

module.exports = {
  setRequestTimeout,
};
