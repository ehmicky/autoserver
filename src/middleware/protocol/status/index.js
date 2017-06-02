'use strict';


const { httpGetStatus, httpGetProtocolStatus } = require('./http');


// Retrieve response's status
const getStatus = function () {
  return async function getStatus(input) {
    try {
      const response = await this.next(input);
      setStatus({ input });
      return response;
    } catch (error) {
      if (!(error instanceof Error)) {
        error = new Error(String(error));
      }

      setStatus({ input, error });
      throw error;
    }
  };
};

const setStatus = function ({ input, error }) {
  const { log, protocol, protocolStatus: currentProtocolStatus } = input;

  // Protocol-specific status, e.g. HTTP status code
  const protocolStatus = currentProtocolStatus ||
    statusMap[protocol].getProtocolStatus({ error });
  // protocol-agnostic status
  const status = statusMap[protocol].getStatus({ protocolStatus });

  // Used to indicate that `status` and `protocolStatus` should be kept
  // by the `error_status` middleware
  const isStatusError = error !== undefined;

  log.add({ protocolStatus, status });
  Object.assign(input, { protocolStatus, status, isStatusError });
};

const statusMap = {
  http: {
    getStatus: httpGetStatus,
    getProtocolStatus: httpGetProtocolStatus,
  },
};


module.exports = {
  getStatus,
};
