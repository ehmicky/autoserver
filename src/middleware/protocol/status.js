'use strict';


const { EngineError } = require('../../error');


// Retrieve response's status
const getStatus = async function (input) {
  const { log } = input;

  try {
    const response = await this.next(input);

    const perf = log.perf.start('protocol.getStatus', 'middleware');
    setStatus({ input });
    perf.stop();

    return response;
  } catch (error) {
    const perf = log.perf.start('protocol.getStatus', 'exception');

    if (!(error instanceof Error)) {
      error = new Error(String(error));
    }

    setStatus({ input, error });

    perf.stop();
    throw error;
  }
};

const setStatus = function ({
  input,
  input: { log, protocolHandler, protocolStatus: currentProtocolStatus },
  error,
}) {
  // Protocol-specific status, e.g. HTTP status code
  const protocolStatus = currentProtocolStatus ||
    protocolHandler.getProtocolStatus({ error });
  if (protocolStatus === undefined) {
    const message = '\'protocolStatus\' must be defined';
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  // protocol-agnostic status
  const status = protocolHandler.getStatus({ protocolStatus });
  if (status === undefined) {
    const message = '\'status\' must be defined';
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  // Used to indicate that `status` and `protocolStatus` should be kept
  // by the `error_status` middleware
  if (error !== undefined) {
    error.isStatusError = true;
  }

  log.add({ protocolStatus, status });
  Object.assign(input, { protocolStatus, status });
};


module.exports = {
  getStatus,
};
