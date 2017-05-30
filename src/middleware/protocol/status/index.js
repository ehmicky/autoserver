'use strict';


const { httpGetStatus, httpGetProtocolStatus } = require('./http');


// Retrieve response's status, which is protocol-specific
// E.g. for HTTP it is status code
const getStatus = function () {
  return async function getStatus(input) {
    try {
      const response = await this.next(input);
      setStatus({ input });
      return response;
    } catch (error) {
      setStatus({ input, error });
      throw error;
    }
  };
};

const setStatus = function ({ input, error }) {
  const { logInfo, protocol, protocolStatus: pStatus } = input;

  const protocolStatus = pStatus ||
    statusMap[protocol].getProtocolStatus({ error });
  const status = statusMap[protocol].getStatus({ protocolStatus });

  logInfo.add({ protocolStatus, status });
  Object.assign(input, { protocolStatus, status });

  if (error) {
    error.extra = error.extra || {};
    Object.assign(error.extra, { protocol_status: protocolStatus, status });
  }
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
