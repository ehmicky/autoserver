'use strict';


const { log } = require('../../../utilities');


const httpLogger = function () {
  return async function httpLogger(input) {
    logRequest(input);

    const response = await this.next(input);
    return response;
  };
};

const logRequest = function ({
  protocol: {
    specific: {
      req: { method, url, headers },
    },
    protocolVersion,
  },
  info: { ip }
}) {
  const protocol = `HTTP/${protocolVersion}`;
  headers = JSON.stringify(headers);
  const message = [protocol, method, url, ip, headers].join(' ');
  log.log(message);
};


module.exports = {
  httpLogger,
};
