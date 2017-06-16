'use strict';


// Retrieve response's status
const getStatus = function () {
  return async function getStatus(input) {
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
};

const setStatus = function ({
  input,
  input: { log, protocolHandler, protocolStatus: currentProtocolStatus },
  error,
}) {
  // Protocol-specific status, e.g. HTTP status code
  const protocolStatus = currentProtocolStatus ||
    protocolHandler.getProtocolStatus({ error });
  // protocol-agnostic status
  const status = protocolHandler.getStatus({ protocolStatus });

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
