'use strict';

const { throwError } = require('../../error');
const { pSetTimeout } = require('../../utilities');
const { getLimits } = require('../../limits');

// Make request fail after some timeout
const setRequestTimeout = function ({ mInput, runOpts }, nextLayer) {
  const timeoutPromise = startRequestTimeout({ runOpts });
  const nextLayerPromise = nextLayer(mInput);

  return Promise.race([timeoutPromise, nextLayerPromise]);
};

const startRequestTimeout = async function ({ runOpts, runOpts: { env } }) {
  const { requestTimeout } = getLimits({ runOpts });
  // When debugging with breakpoints, we do not want any request timeout
  const timeout = env === 'dev' ? hugeTimeout : requestTimeout;

  // Note that the timeout is a minimum, since it will only be fired at the
  // beginning of a new macrotask
  await pSetTimeout(timeout);

  const message = `The request took too long (more than ${timeout / milliSecsToSecs} seconds)`;
  throwError(message, { reason: 'REQUEST_TIMEOUT' });
};

const hugeTimeout = 1e9;
const milliSecsToSecs = 1e3;

module.exports = {
  setRequestTimeout,
};
